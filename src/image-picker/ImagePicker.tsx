import * as React from 'react';
import classNames from 'classnames';
import noop from '../_utils/noop';

export interface File {
  url: string;
}

export interface ImagePickerProps {
  files?: File[];
  width?: string;
  height?: string;
  removeImage?: (params: any) => void;
  formDataAction?: (formData: object, dataUrl: object) => void;
  name?: string;
  customSize: number;
  fileLimitCallback?: (file: object) => void;
}

export default class ImagePicker extends React.PureComponent<ImagePickerProps> {
  static defaultProps = {
    files: [],
    width: '75px',
    height: '75px',
    customSize: 1024,
    removeImage: noop,
  };
  private input: HTMLInputElement | null;

  constructor(props: ImagePickerProps) {
    super(props);
    this.state = {};
    this.fileChange = this.fileChange.bind(this);
  }

  removeImagePriv(index: any) {
    const {removeImage = () => {}} = this.props;
    removeImage(index);
  }

  fileChange(e: any) {
    const {name, formDataAction, customSize, fileLimitCallback} = this.props;
    const file = e.target.files[0];
    const imgFormData = new FormData();

    // 判断上传文件的类型，若不是jpeg jpg png gif类型，不执行上传操作
    if (file && (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif')) {
      return;
    }

    imgFormData.append(`${name}`, file && file);

    // 若customSize设置为0表示不限制图片大小，不设置或者设置为其他值表示采用默认图片大小
    if (customSize !== 0) {
      fileLimitCallback && fileLimitCallback(file && file);
      if (file && file.size > customSize * 1024) {
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const {currentTarget} = e;
      const dataUrl = currentTarget && currentTarget.result;
      if (!dataUrl) {
        return;
      }

      formDataAction && formDataAction(imgFormData, {url: dataUrl});
    };

    file && reader.readAsDataURL(file);

    if (this.input) {
      this.input.value = '';
    }
  }

  render() {
    const {files, name, height, width} = this.props;
    const wrapperCls = classNames('Yep-upload-wrapper');
    return (
      <div className={wrapperCls}>
        {files &&
          files.map((imgItem, index) => (
            <div className="upload-flex-item" key={index}>
              <div
                className="upload-flex-item-del"
                onClick={() => {
                  this.removeImagePriv(index);
                }}
              />
              <img className="upload-flex-item-img" src={`${imgItem.url}`} style={{width: width, height: height}} />
            </div>
          ))}
        <div className="upload-flex-item upload-add">
          <div className="upload-add-picker" style={{width: width, height: height}}>
            <input
              ref={input => {
                this.input = input;
              }}
              type="file"
              name={name}
              accept="image/*"
              onChange={this.fileChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
