import Problem from "../models/problem.model.js"
import Submission from "../models/submission.model.js"
import { getLanguageById, submitBatch, submitToken } from "../utils/problem.utils.js"


export const userSubmission = async(req, res)=>{
    try {
        // console.log("this is the end")
        // console.log(req.result._id)
        const userId = req.result._id
        // console.log(req.params)
        const problemId = req.params.id
        // console.log(problemId)
        // console.log(req.body)
        const {language, code} = req.body

        // console.log(userId)

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Some field is missing")
        }

        // fetch problem from db => to know hiddenTestCases
        // console.log(problemId)
        const problem = await Problem.findById(problemId)
        // console.log("Problem : " + problem)

        // step-1 => submit code in DB
        // console.log(problem.hiddenTestCases)
        const submittedResult = await Submission.create({userId, problemId, code, language, status: "pending", testCaseTotal : problem.hiddenTestCases.length})
        // console.log("Submitted  Result "+submittedResult)


        // step-2 => submit code to judge0
        const languageId = getLanguageById(language)
        // console.log(languageId)
        const submissions = problem.hiddenTestCases.map((testCase)=>({
                source_code: code,
                language_id: languageId,
                stdin : testCase.input,
                expected_output : testCase.output
        }))
        // console.log(submissions)
        const submitResult = await submitBatch(submissions)
        // console.log(submitResult)

        // tokens
        const resultToken = submitResult.map((value)=> value.token)
        // console.log(resultToken)

        // again api call to get the responce from Judge0
        const testResult = await submitToken(resultToken)
        // console.log(testResult)
        /* => apna responce ka format for every test case [{}, {}. {}, {} ...]
                language_id: 62,
                stdin: '7',
                expected_output: 'true',
                stdout: 'true\n',
                status_id: 3,
                created_at: '2025-10-23T06:29:33.485Z',
                finished_at: '2025-10-23T06:29:34.249Z',
                time: '0.069',
                memory: 17052,
                stderr: null,
                token: 'f28f9f1d-6b5a-4ec6-8cbc-933cc901d958',
                number_of_runs: 1,
                cpu_time_limit: '5.0',
                cpu_extra_time: '1.0',
                wall_time_limit: '10.0',
                memory_limit: 256000,
                stack_limit: 64000,
        */

        // Step-3 => update the submission in db

        let testCasesPassed = 0
        let runtime = 0
        let memory = 0
        let status = "accepted"
        let errorMessage = null


        for(const test of testResult){
            if(test.status_id === 3){
                testCasesPassed++
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory, test.memory)
            }
            else{
                if(test.status_id === 4){
                    status = "error"
                }else{
                    status = "wrong"
                }
                errorMessage = test.stderr
            }
        }


        // step-4 => store the rersult in db
        submittedResult.status = status
        submittedResult.testCasePassed = testCasesPassed
        submittedResult.errorMessage = errorMessage
        submittedResult.runtime = runtime
        submittedResult.memory = memory
        await submittedResult.save()


        // step-5 => propogeting in user schema that I have solved this problem
        if(!req.result.problemSolved.includes(problemId)){
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }


        res.status(201).send(submittedResult)

        
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);

    }
}


export const runCode = async(req, res)=>{
    try {
        const userId = req.result._id
        const problemId = req.params.id
        const {language, code} = req.body

        if(!userId || !problemId || !code || !language){
            return res.status(400).send("Some field is missing")
        }

        // fetch problem from db => to know hiddenTestCases
        // console.log(problemId)
        const problem = await Problem.findById(problemId)
        // console.log("Problem : " + problem)



        // step-1 => submit code to judge0
        const languageId = getLanguageById(language)
        const submissions = problem.visibleTestCases.map((testCase)=>({
                source_code: code,
                language_id: languageId,
                stdin : testCase.input,
                expected_output : testCase.output
        }))
        const submitResult = await submitBatch(submissions)
        const resultToken = submitResult.map((value)=> value.token)
        const testResult = await submitToken(resultToken)

        res.status(201).send(testResult)

        
    } catch (error) {
        res.status(500).send(`Internal Server Error: ${error.message}`);

    }
}