(function($) {
    $.fn.uploader = function(options, testMode) {
        return this.each(function(index) {
            options = $.extend({
                submitButtonCopy: '上传选择的文件',
                instructionsCopy: '你可以选择或拖拽多个文件',
                furtherInstructionsCopy: '你可以选择或拖拽更多的文件',
                selectButtonCopy: '选择文件',
                secondarySelectButtonCopy: '选择更多的文件',
                dropZone: $(this),
                fileTypeWhiteList: ['jpg', 'png', 'jpeg', 'gif', 'bmp'],
                badFileTypeMessage: '对不起，我们不能接受这种类型的文件。',
                ajaxUrl: '/ajax/upload',
                ajaxBfun: function(r) {
                    console.log(r);
                },
                ajaxSfun: function(r) {
                    console.log(r);
                },
                ajaxCfun: function(r) {
                    console.log(r);
                },
                testMode: false
            }, options);

            var state = {
                fileBatch: [],
                isUploading: false,
                isOverLimit: false,
                listIndex: 0
            };

            // 创建 DOM 元素
            var dom = {
                uploaderBox: $(this),
                // 提交按钮
                submitButton: $('<button class="js-uploader__submit-button uploader__submit-button uploader__hide">' +
                    options.submitButtonCopy + '<i class="js-uploader__icon fa fa-upload uploader__icon"></i></button>'),
                // 说明文本
                instructions: $('<p class="js-uploader__instructions uploader__instructions">' +
                    options.instructionsCopy + '</p>'),
                // 选择按钮
                selectButton: $('<input style="height: 0; width: 0;" id="fileinput' + index + '" type="file" multiple class="js-uploader__file-input uploader__file-input">' +
                    '<label for="fileinput' + index + '" style="cursor: pointer;" class="js-uploader__file-label uploader__file-label">' +
                    options.selectButtonCopy + '</label>'),
                // 辅助选择按钮
                secondarySelectButton: $('<input style="height: 0; width: 0;" id="secondaryfileinput' + index + '" type="file"' +
                    ' multiple class="js-uploader__file-input uploader__file-input">' +
                    '<label for="secondaryfileinput' + index + '" style="cursor: pointer;" class="js-uploader__file-label uploader__file-label uploader__file-label--secondary">' +
                    options.secondarySelectButtonCopy + '</label>'),
                // 图片列表
                fileList: $('<ul class="js-uploader__file-list uploader__file-list"></ul>'),
                // 容器
                contentsContainer: $('<div class="js-uploader__contents uploader__contents"></div>'),
                // 进一步说明文本
                furtherInstructions: $('<p class="js-uploader__further-instructions uploader__further-instructions uploader__hide">' + options.furtherInstructionsCopy + '</p>')
            };

            // 清空容器
            dom.uploaderBox.empty();

            // 创建并附加UI元素
            setupDOM(dom);

            // 绑定UI事件
            bindUIEvents();

            function setupDOM(dom) {
                dom.contentsContainer
                    .append(dom.instructions)
                    .append(dom.selectButton);
                dom.furtherInstructions
                    .append(dom.secondarySelectButton);
                dom.uploaderBox
                    .append(dom.fileList)
                    .append(dom.contentsContainer)
                    .append(dom.submitButton)
                    .after(dom.furtherInstructions);
            }

            function bindUIEvents() {
                // 处理拖拽事件
                options.dropZone.on('dragover dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                $.event.props.push('dataTransfer'); // jquery bug h ack
                options.dropZone.on('drop', selectFilesHandler);

                // 能够两次选择相同的文件名
                dom.selectButton.on('click', function() {
                    this.value = null;
                });
                dom.selectButton.on('change', selectFilesHandler);
                dom.secondarySelectButton.on('click', function() {
                    this.value = null;
                });
                dom.secondarySelectButton.on('change', selectFilesHandler);

                // 处理提交点击事件
                dom.submitButton.on('click', uploadSubmitHandler);

                // 删除链接
                dom.uploaderBox.on('click', '.js-upload-remove-button', removeItemHandler);

                // 开启测试模式
                if (options.testMode) {
                    options.dropZone.on('uploaderTestEvent', function(e) {
                        switch (e.functionName) {
                            case 'selectFilesHandler':
                                selectFilesHandler(e);
                                break;
                            case 'uploadSubmitHandler':
                                uploadSubmitHandler(e);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }

            function addItem(file) {
                var fileName = cleanName(file.name);
                var fileSize = file.size;
                var id = state.listIndex;
                var sizeWrapper;
                var fileNameWrapper = $('<span class="uploader__file-list__text">' + fileName + '</span>');

                state.listIndex++;

                var listItem = $('<li class="uploader__file-list__item" data-index="' + id + '"></li>');
                var thumbnailContainer = $('<span class="uploader__file-list__thumbnail"></span>');
                var thumbnail = $('<img class="thumbnail"><i class="fa fa-spinner fa-spin uploader__icon--spinner"></i>');
                var removeLink = $('<span class="uploader__file-list__button"><button class="uploader__icon-button js-upload-remove-button fa fa-times" data-index="' + id + '"></button></span>');

                // 验证文件
                if (options.fileTypeWhiteList.indexOf(getExtension(file.name).toLowerCase()) !== -1) {
                    // 文件正常，将其添加到批处理中
                    state.fileBatch.push({
                        file: file,
                        id: id,
                        fileName: fileName,
                        fileSize: fileSize
                    });
                    sizeWrapper = $('<span class="uploader__file-list__size">' + formatBytes(fileSize) + '</span>');
                } else {
                    // 文件不正常，只能将其添加到dom中
                    sizeWrapper = $('<span class="uploader__file-list__size"><span class="uploader__error">' + options.badFileTypeMessage + '</span></span>');
                }

                // 如果可以的话，创建缩略图
                if (window.FileReader && file.type.indexOf('image') !== -1) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        thumbnail.attr('src', reader.result);
                        thumbnail.parent().find('i').remove();
                    };
                    reader.onerror = function() {
                        thumbnail.remove();
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.indexOf('image') === -1) {
                    thumbnail = $('<i class="fa fa-file-o uploader__icon">');
                }

                thumbnailContainer.append(thumbnail);
                listItem.append(thumbnailContainer);

                listItem
                    .append(fileNameWrapper)
                    .append(sizeWrapper)
                    .append(removeLink);

                dom.fileList.append(listItem);
            }

            function getExtension(path) {
                var basename = path.split(/[\\/]/).pop();
                var pos = basename.lastIndexOf('.');

                if (basename === '' || pos < 1) {
                    return '';
                }
                return basename.slice(pos + 1);
            }

            function formatBytes(bytes, decimals) {
                if (bytes === 0) return '0 Bytes';
                var k = 1024;
                var dm = decimals + 1 || 3;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
            }

            function cleanName(name) {
                name = name.replace(/\s+/gi, '-'); // 用破折号替换空白
                return name;
                // return name.replace(/[^a-zA-Z0-9.\-]/gi, ''); // 去掉任何特殊字符
            }

            function uploadSubmitHandler() {
                if (state.fileBatch.length !== 0) {
                    var data = new FormData();
                    for (var i = 0; i < state.fileBatch.length; i++) {
                        data.append('files[]', state.fileBatch[i].file, state.fileBatch[i].fileName);
                    }
                    $.ajax({
                        type: 'POST',
                        url: options.ajaxUrl,
                        data: data,
                        cache: false,
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        beforeSend: function() {
                            options.ajaxBfun();
                        },
                        success: function(data) {
                            options.ajaxSfun(data);
                            state.fileBatch = [];
                            dom.fileList.empty();
                            renderControls();
                        },
                        complete: function() {
                            options.ajaxCfun();
                        }
                    });
                }
            }

            function selectFilesHandler(e) {
                e.preventDefault();
                e.stopPropagation();

                if (!state.isUploading) {
                    // 文件来自输入或拖放
                    var files = e.target.files || e.dataTransfer.files || e.dataTransfer.getData;

                    // 处理每个传入文件
                    for (var i = 0; i < files.length; i++) {
                        addItem(files[i]);
                    }
                }
                renderControls();
            }

            function renderControls() {
                if (dom.fileList.children().size() !== 0) {
                    dom.submitButton.removeClass('uploader__hide');
                    dom.furtherInstructions.removeClass('uploader__hide');
                    dom.contentsContainer.addClass('uploader__hide');
                } else {
                    dom.submitButton.addClass('uploader__hide');
                    dom.furtherInstructions.addClass('uploader__hide');
                    dom.contentsContainer.removeClass('uploader__hide');
                }
            }

            function removeItemHandler(e) {
                e.preventDefault();

                if (!state.isUploading) {
                    var removeIndex = $(e.target).data('index');
                    removeItem(removeIndex);
                    $(e.target).parent().remove();
                }

                renderControls();
            }

            function removeItem(id) {
                // 从批处理中删除
                for (var i = 0; i < state.fileBatch.length; i++) {
                    if (state.fileBatch[i].id === parseInt(id)) {
                        state.fileBatch.splice(i, 1);
                        break;
                    }
                }
                // 从DOM中删除
                dom.fileList.find('li[data-index="' + id + '"]').remove();
            }
        });
    };
}(jQuery));