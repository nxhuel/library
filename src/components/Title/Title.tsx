import "./style/index.css";

function Title({ title }: { title: string }) {
  return (
    <>
      <div className="pt-8 pb-8">
        <h1 className="text-[#1C2022] dark:text-white text-2xl font-mono md:text-3xl">
          {title}
        </h1>
      </div>
    </>
  );
}
export default Title;
