import React from "react";

type Props = {
  addNotification: (title: string, message: string, type: string) => void;
  file?: File | undefined;
  onChange?: (arg0: File) => void;
  currentPlatform?: any;
};

const types = [
  "csv",
  "xls",
  "xlsx",
  "json",
  "vnd.ms-excel",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];
const maxSize = 10;

const checkType = (file: File, types: Array<string>): boolean => {
  const fileType: string = file.type.toLocaleLowerCase();
  const extensionIndex: number = fileType.lastIndexOf("/");
  const extension: string = fileType.substring(extensionIndex + 1);
  const loweredTypes = types.map(type => type.toLowerCase());
  return loweredTypes.includes(extension);
};

const getFileSizeMB = (size: number): number => {
  return size / 1024 / 1024;
};

const getFileSize = (size: number): string => {
  if (!size) return "";

  if (size / 1048576 > 1) {
    return `${(size / 1048576).toFixed(2)} MB`;
  }

  return `${(size / 1024).toFixed(2)} KB`;
};

class FileUploader extends React.Component<Props> {
  handleChanges = (file: File): boolean => {
    if (file) {
      if (types && !checkType(file, types)) {
        this.props.addNotification(
          "Warning",
          "This file type is not supported!",
          "warn"
        );
        return false;
      }
      if (maxSize && getFileSizeMB(file.size) > maxSize) {
        this.props.addNotification(
          "Warning",
          "Size of selected file is bigger than 10 MB!",
          "warn"
        );
        return false;
      }
      return true;
    }
    return false;
  };

  handleInputChange = (ev: any) => {
    const file = ev.target.files[0];
    ev.target.value = "";
    const success = this.handleChanges(file);
    if (success) {
      (this.props as any).onChange(file);
    }
  };

  render() {
    return (
      <div className="relative">
        <input
          type="file"
          id="file-upload"
          name="file-upload"
          onChange={this.handleInputChange}
          className="absolute cursor-pointer opacity-0 flex justify-center w-full py-20 border-2 border-gray-300 hover:border-indigo-200 border-dashed rounded-md"
        />
        <div className="mt-8 flex justify-center px-6 py-12 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <>
              {!this.props.file ? (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        onChange={this.handleInputChange}
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  {this.props.currentPlatform?.value === "Amazon_B2C" ||
                  this.props.currentPlatform?.value === "Amazon_B2B" ? (
                    <p className="text-xs text-gray-500">CSV up to 10MB</p>
                  ) : this.props.currentPlatform?.value === "Gstr2A" ||
                    this.props.currentPlatform?.value === "Gstr2B" ? (
                    <p className="text-xs text-gray-500">JSON up to 10MB</p>
                  ) : (
                    <p className="text-xs text-gray-500">XLSX up to 10MB</p>
                  )}
                </>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none"
                    >
                      <p className="text-sm text-gray-600">
                        {this.props.file?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getFileSize(this.props.file?.size)}
                      </p>
                      <br />
                      <input
                        id="file-upload"
                        name="file-upload"
                        onChange={this.handleInputChange}
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    );
  }
}

export default FileUploader;
