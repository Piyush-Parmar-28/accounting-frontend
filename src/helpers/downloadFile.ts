export const downloadFile = (response: any, fileName: string) => {
  const { data, headers } = response;

  const blob = new Blob([data], { type: headers["content-type"] });
  let dom = document.createElement("a");
  let url = window.URL.createObjectURL(blob);
  dom.href = url;
  dom.download = decodeURI(fileName);
  dom.style.display = "none";
  document.body.appendChild(dom);
  dom.click();
  dom.parentNode?.removeChild(dom);
  window.URL.revokeObjectURL(url);
};
