import eyeBlueIcon from "../assets/svg/eye_blue.js";
import downloadBlueIcon from "../assets/svg/download_blue.js";
import download from "../assets/svg/download_blue.js";
export default (billUrl) => {
  return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
      <a href'#' target="_blank" id="download-link-blue" data-testid='download-link-blue' data-bill-name="${billUrl}" data-bill-url="${billUrl}">
      <span id="icon-download-blue"  > ${download} </span>
    </a>
    </div>`;
};
