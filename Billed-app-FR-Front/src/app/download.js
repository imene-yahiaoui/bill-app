export const download = async () => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const image = new Image();
  image.src = $("#icon-download").attr("data-bill-url");
  console.log($("#icon-download").attr("data-bill-url"));
  doc.addImage(image, "png", 15, 40, 180, 160);
  const pdfdow = await doc.save(
    $("#download-link").attr("data-bill-name") + ".pdf"
  );
  const downloadLink = $("#download-link");
 };

