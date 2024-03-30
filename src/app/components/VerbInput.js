export default function VerbInput({
  index,
  value,
  verbData,
  setVerbData,
  inputId,
  inputName,
  short,
  correctAnswer,
}) {
  const presenteLabels = ["Name", "io", "tu", "lui/lei", "noi", "voi", "loro"];

  if (short) {
    presenteLabels.shift();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerbData({
      ...verbData,
      [name]: value,
    });
  };

  const handleDoubleClick = (e) => {
    const { name } = e.target;
    setVerbData({
      ...verbData,
      [name]: "",
    });
  };

  return (
    <div className="w-[80%] grid grid-cols-4 items-center">
      <p>{presenteLabels[index]}</p>
      <input
        onChange={handleChange}
        onDoubleClick={handleDoubleClick}
        value={value}
        type="text"
        id={inputId}
        name={inputName}
        className={`pl-6 min-h-[2.8rem] col-span-3 border border-gray-300 ${
          correctAnswer === true
            ? "font-bold text-green-700"
            : correctAnswer === false
            ? "font-bold text-red-500"
            : ""
        } rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:border-2 focus:border-lightblue`}
      />
    </div>
  );
}
