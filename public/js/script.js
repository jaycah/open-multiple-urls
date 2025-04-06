document.addEventListener('DOMContentLoaded', function() {
    // Toggle mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Process URLs and keywords
    const submitBtn = document.getElementById('submit-btn');
    const inputText = document.getElementById('input-text');
    const popupWarning = document.getElementById('popup-warning');
    const closeWarning = document.getElementById('close-warning');
    
    if (closeWarning) {
        closeWarning.addEventListener('click', function() {
            popupWarning.classList.add('hidden');
        });
    }
    
    if (submitBtn && inputText) {
        submitBtn.addEventListener('click', function() {
            processInput(inputText.value);
        });
    }
    
    function processInput(text) {
        if (!text.trim()) {
            alert('请输入一些URL或关键词。');
            return;
        }
        
        // 只使用换行和逗号分隔，不再使用空格
        let items = text.split(/[\n,]+/)
            .map(item => item.trim())
            .filter(item => item !== '');
        
        // 不再需要进一步处理空格分隔的情况
        let allItems = items;
        
        // Process each item
        let popupBlocked = false;
        let processedCount = 0;
        
        allItems.forEach(item => {
            if (item.includes('.')) {
                // 处理URL
                let url = item;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                
                const newWindow = window.open(url, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    popupBlocked = true;
                } else {
                    processedCount++;
                }
            } else {
                // 处理关键词 - 使用谷歌搜索
                const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(item);
                const newWindow = window.open(searchUrl, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    popupBlocked = true;
                } else {
                    processedCount++;
                }
            }
        });
        
        // 显示弹出窗口被阻止的警告
        if (popupBlocked && popupWarning) {
            popupWarning.classList.remove('hidden');
        }
        
        // 显示处理结果
        if (processedCount > 0) {
            const message = `成功处理了 ${processedCount} 个项目。${popupBlocked ? '部分弹出窗口被阻止。' : ''}`;
            console.log(message);
            // 可以选择显示一个成功消息给用户
            // alert(message);
        } else if (popupBlocked) {
            alert('所有弹出窗口都被阻止了。请允许此网站的弹出窗口，然后重试。');
        }
    }
    
    // 语言切换功能
    window.changeLanguage = function(lang) {
        window.location.href = `/change-language/${lang}`;
    };
});