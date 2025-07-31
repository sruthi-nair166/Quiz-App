import categories from "./Categories.jsx";

export default function CategoryDisplay({setCategory}) {

  const handleClick = e => {
    setCategory(e.target.textContent);
  }

  return (
    <>
      {Object.keys(categories).map(key => {
        return <button key={key} onClick={handleClick}>{key}</button> 
      })}
    </>
  );

}