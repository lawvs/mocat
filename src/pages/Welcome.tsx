import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './Welcome.less';

const CodePreview: React.FC<{ language?: string }> = ({ children, language }) => (
  <SyntaxHighlighter language={language} style={a11yDark} className={styles.pre}>
    {children}
  </SyntaxHighlighter>
);

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Typography.Text strong>
        欢迎使用{' '}
        <a href="https://github.com/lawvs/mocat" rel="noopener noreferrer" target="__blank">
          Mocat
        </a>
      </Typography.Text>
      <CodePreview language="shell">yarn add --dev mocat</CodePreview>
      <Typography.Text strong>用法</Typography.Text>
      <CodePreview language="javascript">
        {`
import { create } from 'mocat'

const app = create()

app.mockRoutes([
  {
    // 接口名
    name: '登录',
    url: '/api/login/account',
    method: 'GET',
    scenarios: [
      {
        // 场景名
        name: '管理员',
        // 场景描述（可选）
        desc: '可以看到管理员权限面板',
        // status: 200,
        // 响应
        response: { status: 'ok', type: 'account', currentAuthority: 'admin' },
      },
      {
        name: '普通用户',
        response: { status: 'ok', type: 'account', currentAuthority: 'user' },
      },
      {
        name: '账户或密码错误',
        desc: '输入了错误的密码',
        response: {
          status: 'error',
          type: 'account',
          currentAuthority: 'guest',
        },
      },
    ],
  },
])
    `.trim()}
      </CodePreview>
    </Card>
  </PageContainer>
);
