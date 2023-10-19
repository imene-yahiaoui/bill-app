import { notFound } from "../views/notFound.js";
export const download = async () => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const image = new Image();
  if (
    $("#icon-download").attr("data-bill-url") === "http://localhost:5678/null"
  ) {
    image.src = `${notFound}`;
  } else {
    image.src = $("#icon-download").attr("data-bill-url");
  }

  doc.addImage(image, "png", 15, 40, 180, 160);
  const pdfdow = await doc.save(
    $("#download-link").attr("data-bill-name") + ".pdf"
  );
  const downloadLink = $("#download-link");
};

$("#icon-download").click(() => {
  download();
});
