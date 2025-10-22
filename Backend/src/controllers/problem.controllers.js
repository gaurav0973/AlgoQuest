import { getLanguageById, submitBatch } from "../utils/problem.utils.js"

export const createProblem = async(req, res) =>{
    

    const {title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator} = req.body

    
    try {


        for(const {language, completeCode} of referenceSolution){
            // source_code :  <- completeCode
            // language_id :  <- ek function banana padega 
            // stdin :  <- visibleTestCases me present hai
            // expected_output :  <- visibleTestCases me present hai
            const languageId = getLanguageById(language)

            // Batch submissions -> array 
            const submissions = visibleTestCases.map((input, output)=>({
                source_code: completeCode,
                language_id: languageId,
                stdin : input,
                expected_output : output
            }))

            const submitResult = await submitBatch(submissions)

        }

        
    } catch (error) {
        
    }

}

export const fetchProblem = async(req, res) =>{

}

export const getAllProblems = async(req, res) =>{

}

export const updateProblem = async(req, res)=>{

}

export const deleteProblem = async(req, res) =>{

}

export const getSolvedProblems = async(req, res)=>{

}