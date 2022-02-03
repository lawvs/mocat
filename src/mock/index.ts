/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
import { create } from 'mocat';

function main() {
  const app = create({ debug: true });

  app.mockRoutes([
    {
      name: '登录',
      url: '/api/login/account',
      scenarios: [
        {
          name: '管理员',
          desc: '可以看到管理员权限面板',
          response: { status: 'ok', type: 'account', currentAuthority: 'admin' },
        },
        { name: '普通用户', response: { status: 'ok', type: 'account', currentAuthority: 'user' } },
        {
          name: '账户或密码错误',
          desc: '输入了错误的密码',
          response: { status: 'error', type: 'account', currentAuthority: 'guest' },
        },
      ],
    },

    {
      name: '当前用户',
      url: '/api/currentUser',
      scenarios: [
        {
          name: '张三',
          response: require('./currentUser.json'),
        },
        {
          name: '无权限',
          desc: '返回 401',
          status: 401,
        },
      ],
    },

    {
      name: '表格',
      url: '/api/rule',
      method: 'GET',
      scenarios: [
        {
          name: '默认',
          response: require('./rule.json'),
        },
        {
          name: '无数据',
          response: {
            data: [],
            total: 0,
            success: true,
            pageSize: '20',
            current: 1,
          },
        },
      ],
    },

    {
      name: '更新表单',
      url: '/api/rule',
      method: 'POST',
      scenarios: [
        {
          name: '更新成功',
          response: require('./postRule.json'),
        },
        {
          name: '更新失败',
          status: 400,
        },
      ],
    },
  ]);
}

const urlParams = new URLSearchParams(window.location.search);
const enableMocat = urlParams.get('mocat');
if (enableMocat !== 'false') {
  main();
}
