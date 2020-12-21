import React,  { useState, useEffect, useRef } from 'react';
import './DragnDrop.css';
import axios from 'axios';


const DragnDrop = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);
    const [invalidFiles, setInvalidFiles] = useState([]);
    const viewImageRef = useRef();
    const viewRef = useRef();
    const selectFileRef = useRef();
    const uploadViewRef = useRef();
    const uploadRef = useRef();
    const progressRef = useRef();


    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            if (validate(files[i])) {
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                files[i]['invalid'] = true;
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                setErrorMessage('Incorrect file type');
                setInvalidFiles(prevArray => [...prevArray, files[i]]);
            }
        }
    }
    
    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);
    
    }, [selectedFiles]);

    const removeFile = (name) => {
    
        const validFileIndex = validFiles.findIndex(e => e.name === name);
        validFiles.splice(validFileIndex, 1);

        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
        selectedFiles.splice(selectedFileIndex, 1);

        setSelectedFiles([...selectedFiles]);

        const invalidFileIndex = invalidFiles.findIndex(e => e.name === name);
        if (invalidFileIndex !== -1) {
            invalidFiles.splice(invalidFileIndex, 1);
            setInvalidFiles([...invalidFiles]);
        }
    }

    const openImageView = (file) => {
        const reader = new FileReader();
        viewRef.current.style.display = "block";
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            viewImageRef.current.style.backgroundImage = `url(${e.target.result})`;
        }
    }

    const closeView = () => {
        viewRef.current.style.display = "none";
        viewImageRef.current.style.backgroundImage = 'none';
    }

    const selectFilesClick = () => {
        selectFileRef.current.click();
    }

    const selectFiles = () => {
        if (selectFileRef.current.files.length) {
            handleFiles(selectFileRef.current.files);
        }
    }

    const closeUploadView = () => {
        uploadViewRef.current.style.display = 'none';
    }

    const uploadFiles = async () => {
        uploadViewRef.current.style.display = 'block';
        uploadRef.current.innerHTML = 'File(s) Uploading...';
        for (let i = 0; i < validFiles.length; i++) {
            const formData = new FormData();
            formData.append('image', validFiles[i]);
            formData.append('key', 'd1c21236ab043000a520103fb587f677');

            axios.post('https://api.imgbb.com/1/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    progressRef.current.innerHTML = `${uploadPercentage}%`;
                    progressRef.current.style.width = `${uploadPercentage}%`;

                    if (uploadPercentage === 100) {
                        uploadRef.current.innerHTML = 'File(s) Uploaded';
                        validFiles.length = 0;
                        setValidFiles([...validFiles]);
                        setSelectedFiles([...validFiles]);
                        setInvalidFiles([...validFiles]);
                    }
                },
            })
            .catch(() => {
                uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
                progressRef.current.style.backgroundColor = 'red';
            })
            // fetch('http://localhost:3000/upload/', {
			// method: 'POST',
			// body: formData
            // }).then(
            //     (progressEvent) => {
            //         const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            //         progressRef.current.innerHTML = `${uploadPercentage}%`;
            //         progressRef.current.style.width = `${uploadPercentage}%`;
            //         if (uploadPercentage === 100) {
            //             uploadRef.current.innerHTML = 'File(s) Uploaded';
            //             validFiles.length = 0;
            //             setValidFiles([...validFiles]);
            //             setSelectedFiles([...validFiles]);
            //             setInvalidFiles([...validFiles]);
            //         }
            //     })
            //     .catch(() => {
            //         uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
            //         progressRef.current.style.backgroundColor = 'red';
            //     });
        }
    }
    
    const dragOver = (e) => {
        e.preventDefault();
    }
    
    const dragEnter = (e) => {
        e.preventDefault();
    }
    
    const dragLeave = (e) => {
        e.preventDefault();
    }
    
    const validate = (file) => {
        const validTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/x-icon'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    }
    
    const fileDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }
    
    return (
        <>
        <div className="file-button">
            {invalidFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''} 
            {invalidFiles.length ? <p>Please remove all unsupported files.</p> : ''}
        </div>
        <div className="container"
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
            onClick={selectFilesClick}>
            <div className="drop-container">

                <div className="drop-message">
                <input
                    ref={selectFileRef}
                    className="file-select"
                    type="file"
                    multiple
                    onChange={selectFiles}
                />
                    <div className="upload-icon"></div>
                    ფაილი ჩააგდეთ აქ ან დააჭირეთ, რომ ფაილი აიტვირთოს
                </div>

                <div className="file-display-container">
                {
                    validFiles.map((data, i) => 
                        <div className="file-status-bar" key={i}>
                            <div onClick={!data.invalid ? () => openImageView(data) : () => removeFile(data.name)}>
                                <div className="file-type-logo"></div>
                                <div className="file-type">{fileType(data.name)}</div>
                                <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                            </div>
                            <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                        </div>
                    )
                }
                </div>
            </div>
        </div>

        <div className="view" ref={viewRef}>
            <div className="overlay"></div>
            <span className="close" onClick={(() => closeView())}>X</span>
            <div className="view-image" ref={viewImageRef}></div>
        </div>

        <div className="upload-modal" ref={uploadViewRef}>
            <div className="overlay"></div>
            <div className="close" onClick={(() => closeUploadView())}>X</div>
            <div className="progress-container">
                <span ref={uploadRef}></span>
                <div className="progress">
                    <div className="progress-bar" ref={progressRef}></div>
                </div>
            </div>
        </div>

        </>
    )
}
export default DragnDrop;