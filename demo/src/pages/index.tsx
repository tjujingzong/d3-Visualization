import styles from './index.less';
import { Row, Col } from 'antd';
import Scatter1 from './Scatter1';
import Scatter2 from './Scatter2';
const index: React.FC = () => {
  return (
    <Row align="middle">
      <Col span={12} style={{ border: '1px solid #222' }} >
        <div style={{ width: '50vw', height: '100vh' }}>
          <Scatter1></Scatter1>
        </div>
      </Col>
      <Col span={12} style={{ border: '1px solid #222' }} >
        <div style={{ width: '50vw', height: '100vh' }}>
          <Scatter2></Scatter2>
        </div>
      </Col>
    </Row>
  );
}
export default index;