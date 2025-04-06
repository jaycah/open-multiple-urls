const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// 设置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 语言配置
const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
];

// 翻译文件
const translations = require('./translations');

// 路由
// 在路由处理中确保translations对象正确传递
app.get('/', (req, res) => {
    // 获取用户语言偏好
    const userLocale = req.query.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    
    // 确保我们支持该语言，否则默认为英语
    const locale = availableLanguages.some(lang => lang.code === userLocale) ? userLocale : 'en';
    
    // 添加调试日志
    console.log('Locale:', locale);
    console.log('Available translations:', Object.keys(translations));
    console.log('Translation structure:', JSON.stringify(translations[locale]?.features || 'undefined'));
    
    // 确保translations[locale]存在
    const translationData = translations[locale] || translations['en'];
    
    res.render('index', {
        locale,
        availableLanguages,
        translations: translationData
    });
});

// 语言切换路由
app.get('/change-language/:lang', (req, res) => {
    const lang = req.params.lang;
    if (availableLanguages.some(l => l.code === lang)) {
        res.redirect(`/?lang=${lang}`);
    } else {
        res.redirect('/');
    }
});

// 添加通配符路由，处理所有其他请求
app.get('*', (req, res) => {
    res.redirect('/');
});

// 启动服务器
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// 为Vercel导出应用
module.exports = app;