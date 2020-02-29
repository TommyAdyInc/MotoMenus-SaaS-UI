export const downloadPdf = (data, name) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = "data:application/pdf;base64," + data;
  downloadLink.download = name;
  downloadLink.click();
  downloadLink.remove();
};

export const downloadCsv = (data, name) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = "data:application/vnd.ms-excel;base64," + data;
  downloadLink.download = name;
  downloadLink.click();
  downloadLink.remove();
};
