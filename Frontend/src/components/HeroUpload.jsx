export default function HeroUpload() {

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
  };

  return (
    <div className="bg-white p-10 rounded-3xl shadow-sm text-center">

      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Smart AI Road Monitoring
      </h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl p-12 cursor-pointer hover:bg-blue-50 transition">

        <div className="text-5xl mb-4">📷</div>

        <p className="text-gray-600">
          Drag & drop image or click to upload
        </p>

        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />

      </label>
    </div>
  );
}
