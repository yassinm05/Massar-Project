import DoubleRangeSlider from "../ui/doubleRangeSlider";


export default function CourseCatalogFilter() {
  return (
    <section className="flex">
      <div className="relative w-44 ">
        <DoubleRangeSlider labelName="Difficulty" />
      </div>
      <div></div>
    </section>
  );
}
