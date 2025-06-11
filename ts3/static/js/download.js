document.addEventListener('DOMContentLoaded', function() {
    const downloadLink = document.getElementById('download-ts');
    let preloadedDownloadLinks = null; // 预加载的 JSON 数据缓存（新增）

    // 移动设备检测函数
    const isMobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // 平台检测函数
    const getPlatform = function() {
        if (/Win/i.test(navigator.platform)) {
            return 'windows';
        } else if (/Mac/i.test(navigator.platform)) {
            return 'macos';
        } else if (/Linux/i.test(navigator.platform)) {
            return 'linux';
        } else {
            return 'other';
        }
    };

    // 创建弹窗的完整函数
    const createModal = function(content) {
        const modal = document.createElement('div');
        modal.className = 'download-modal';
        modal.innerHTML = [
            '<div class="modal-content">',
            content,
            '<button class="close-btn">×</button>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);

        setTimeout(function() {
            modal.classList.add('visible');
        }, 10);

        const closeModal = function() {
            modal.classList.remove('visible');
            setTimeout(function() {
                modal.remove();
            }, 300);
        };

        modal.querySelector('.close-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        return modal;
    };

    // 预加载 JSON 数据（新增）
    fetch('https://file-us.ovofish.com/local_download_links.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('预加载失败：网络响应不正常');
            }
            return response.json();
        })
        .then(function(data) {
            preloadedDownloadLinks = data; // 缓存预加载数据
        })
        .catch(function(error) {
            console.error('预加载下载链接失败:', error);
            // 预加载失败不影响后续逻辑，用户点击时会重新请求
        });

    if (downloadLink) {
        downloadLink.addEventListener('click', function(event) {
            event.preventDefault();

            // 移动设备处理
            if (isMobile()) {
                createModal([
                    '<h3>设备兼容性提示</h3>',
                    '<p style="color: #e74c3c; font-size: 1.1rem;">🚫 暂不支持移动端下载</p>',
                    '<p>请使用桌面设备访问：</p>',
                    '<button class="version-btn" onclick="window.open(\'https://teamspeak.com/en/downloads/\', \'_blank\')">',
                    '访问官网下载',
                    '</button>'
                ].join(''));
                return;
            }

            // 桌面设备处理（修改：优先使用预加载数据）
            const platform = getPlatform();
            const dataSource = preloadedDownloadLinks || fetch('https://file-us.ovofish.com/local_download_links.json'); // 优先使用缓存

            // 若预加载成功，直接使用缓存数据；否则重新请求
            if (preloadedDownloadLinks) {
                handleDownload(preloadedDownloadLinks, platform);
            } else {
                fetch('https://file-us.ovofish.com/local_download_links.json')
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('网络响应不正常');
                        }
                        return response.json();
                    })
                    .then(function(data) {
                        handleDownload(data, platform);
                    })
                    .catch(function(error) {
                        console.error('获取下载链接失败:', error);
                        if (error.message.includes('CORS')) {
                            createModal([
                                '<h3>网络错误</h3>',
                                '<p style="color: #e74c3c;">无法获取下载链接，可能是服务器配置问题，请稍后再试或联系管理员。</p>'
                            ].join(''));
                        }
                        window.open('https://teamspeak.com/en/downloads/', '_blank');
                    });
            }

            // 提取下载逻辑为独立函数（新增）
            function handleDownload(data, platform) {
                const modalContent = [
                    '<h3>选择版本 (' + platform.toUpperCase() + ')</h3>'
                ];

                if (data.Ver3.length > 0) {
                    modalContent.push('<button class="version-btn" data-version="Ver3">TeamSpeak 3 客户端</button>');
                }
                if (data.Ver6.length > 0) {
                    modalContent.push('<button class="version-btn" data-version="Ver6">TeamSpeak 6 客户端</button>');
                }
                if (data.Ver3.length > 0) {
                    modalContent.push('<button class="version-btn" data-version="Ver3Server">TeamSpeak 3 服务器</button>');
                }

                const modal = createModal(modalContent.join(''));

                modal.querySelectorAll('.version-btn').forEach(function(button) {
                    button.addEventListener('click', function(event) {
                        const version = event.target.dataset.version;
                        let downloadUrl = '';
                        const isWindows = platform === 'windows';
                        const isMac = platform === 'macos';
                        const isLinux = platform === 'linux';

                        if (version === 'Ver3') {
                            if (isWindows) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return url.includes('Client-win') && url.endsWith('.exe');
                                });
                            } else if (isMac) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return url.includes('Client-macosx') && url.endsWith('.dmg');
                                });
                            } else if (isLinux) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return (url.includes('Client-linux') || url.includes('linux_amd64')) && 
                                        (url.endsWith('.run') || url.endsWith('.tar.bz2'));
                                });
                            }
                        } else if (version === 'Ver6') {
                            if (isWindows) {
                                downloadUrl = data.Ver6.find(function(url) {
                                    return url.includes('client.msi');
                                });
                            } else if (isMac) {
                                downloadUrl = data.Ver6.find(function(url) {
                                    return url.includes('client.dmg');
                                });
                            } else if (isLinux) {
                                downloadUrl = data.Ver6.find(function(url) {
                                    return url.includes('client.tar.gz');
                                });
                            }
                        } else if (version === 'Ver3Server') {
                            if (isWindows) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return url.includes('server_win') && url.endsWith('.zip');
                                });
                            } else if (isMac) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return url.includes('server_mac') && url.endsWith('.zip');
                                });
                            } else if (isLinux) {
                                downloadUrl = data.Ver3.find(function(url) {
                                    return url.includes('server_linux') && url.endsWith('.tar.bz2');
                                });
                            }
                        }

                        if (downloadUrl) {
                            window.open(downloadUrl, '_blank');
                        } else {
                            alert('该版本暂无可用的下载链接');
                            window.open('https://teamspeak.com/en/downloads/', '_blank');
                        }

                        modal.remove();
                    });
                });
            }
        });
    }
});