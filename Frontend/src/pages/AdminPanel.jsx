import { useNavigate } from "react-router";
import { Plus, FileEdit, Trash2, Video } from "lucide-react";

function AdminPanel() {
  const navigate = useNavigate();

const adminFeatures = [
  {
    icon: <Plus className="w-12 h-12 text-emerald-500" />,
    title: "Create Problem",
    description: "Add a new coding problem to the platform",
    route: "/admin/create",
    buttonText: "Create Problem",
    buttonClass: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    icon: <FileEdit className="w-12 h-12 text-yellow-500" />,
    title: "Update Problem",
    description: "Edit existing problems and their details",
    route: "/admin/update",
    buttonText: "Update Problem",
    buttonClass: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    icon: <Trash2 className="w-12 h-12 text-rose-500" />,
    title: "Delete Problem",
    description: "Remove problems from the platform",
    route: "/admin/delete",
    buttonText: "Delete Problem",
    buttonClass: "bg-rose-500 hover:bg-rose-600",
  },
  {
    icon: <Video className="w-12 h-12 text-indigo-500" />,
    title: "Upload and Delete Videos",
    description: "Add and delete tutorial or solution videos to the platform",
    route: "/admin/upload-videos",
    buttonText: "Upload/Delete Video",
    buttonClass: "bg-indigo-500 hover:bg-indigo-600",
  },
];


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-400 text-lg">
          Manage coding problems on your platform
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {adminFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:scale-105"
            >
              <div className="mb-4 p-4 bg-gray-700/50 rounded-full">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-400 mb-6">{feature.description}</p>
              <button
                onClick={() => navigate(feature.route)}
                className={`${feature.buttonClass} text-white px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                {feature.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
