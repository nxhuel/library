import "./style/index.css";

function Title({ title }: { title: string }) {
  return (
    <>
      <div className="pt-8 pb-8">
        <h1 className="text-white text-3xl font-mono">{title}</h1>
      </div>
    </>
  );
}
export default Title;
