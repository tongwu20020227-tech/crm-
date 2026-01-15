
import { ExistingCustomer, ProspectCustomer } from './types';

export const MOCK_EXISTING_CUSTOMERS: ExistingCustomer[] = [
  {
    id: 'e1',
    name: '五粮液集团有限公司',
    address: '四川省宜宾市翠屏区岷江西路150号',
    status: '合作中',
    score: 94,
    scoreTrend: 'up',
    healthDimensions: [
      { name: '业务用量', score: 98, status: 'excellent' },
      { name: '满意度', score: 92, status: 'excellent' },
      { name: '异常响应', score: 88, status: 'normal' }
    ],
    briefTip: '续约预警：WMS接口吞吐量激增60%，SKU周转路径出现瓶颈，急需扩充“弹性云仓”配额。',
    industry: '白酒制造',
    years: 5,
    revenue: '600亿+',
    employees: '30000+',
    contractStatus: '合同履行中 (2025-06)',
    contacts: [{ name: '张总监', role: '供应链战略部', phone: '13812340001' }],
    painPoints: {
      current: ['旺季前置仓波峰承载力不足', '全链路追溯系统在高频调用下的延迟问题'],
      potential: ['DTC模式下的末端路由优化', '区域仓储自动化 AGV 协同效率提升']
    },
    solutions: [
      { title: 'VMI 供应商库存管理优化', desc: '基于大数据预测的库存前置方案，降低渠道周转天数。', benefits: ['零库存积压', '极速履约'], stats: 'DOH降低12天', icon: '🍶' }
    ],
    cases: [
      { 
        company: '泸州老窖', 
        industry: '白酒制造', 
        desc: '引入“全链路防伪溯源2.0”后，串货识别率提升至99.9%，显著优化库存周转。', 
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop' 
      }
    ],
    scripts: [
      '【预警破冰】张总，WMS后台显示动销率已达95%临界点，若不及时扩充“弹性云仓”，下周大促将面临塞港风险。',
      '【价值升级】利用“亚洲一号”智能分拣线实现“越库直发”，可将转运时间从4H压缩至45min。'
    ],
    signals: { behaviorChange: 'API流量异常', freqChange: '季度复盘', churnRisk: '低', renewalSignal: '高', focus: '弹性' },
    actions: { direction: '推动扩容', valuePoints: ['全链路可靠性', '动态路由成本'], nextSteps: ['确认春季波峰预测', '提交方案评估报告'] },
    lastVisit: '2024-11-20',
    nextMilestone: '2024-12-15 季度会议'
  },
  {
    id: 'e2',
    name: '蒙牛集团',
    address: '内蒙古呼和浩特市和林格尔盛乐经济园区',
    status: '合作中',
    score: 82,
    scoreTrend: 'down',
    healthDimensions: [
      { name: '业务用量', score: 85, status: 'normal' },
      { name: '回访满意度', score: 78, status: 'warning' },
      { name: '异常响应', score: 82, status: 'normal' }
    ],
    briefTip: '流失预警：冷链运输环节出现“断链预警”报警2次，客户近期调研竞品方案，需紧急公关。',
    industry: '乳制品',
    years: 3,
    revenue: '900亿+',
    employees: '40000+',
    contractStatus: '合同履行中 (2025-03)',
    contacts: [{ name: '李经理', role: '冷链物流部', phone: '13987654321' }],
    painPoints: {
      current: ['冷链“断链”导致货损率波动', '多级分拨中心数据非实时'],
      potential: ['ESG合规', '循环保温箱回收体系优化']
    },
    solutions: [
      { title: '青龙系统·实时遥测', desc: '毫秒级同步车厢内温湿度数据，自动触发异常告警。', benefits: ['全程温控', '实时追溯'], stats: '货损率降低25%', icon: '❄️' }
    ],
    cases: [
      { 
        company: '伊利乳业', 
        industry: '乳制品', 
        desc: '通过“青龙系统”实现了全流程“一码追溯”，通过智能温控降低了20%的仓储损耗。', 
        image: 'https://images.unsplash.com/photo-1528498033943-3414fd5f6ac8?q=80&w=800&auto=format&fit=crop' 
      }
    ],
    scripts: [
      '【品质承诺】李工，杭州干线触发了两次温度预警，我们必须接入“NB-IoT传感器”实现强制闭环。',
      '【赋能挽留】针对货损痛点，我们总部特别批示了“先行赔付”绿色通道，并免费升级青龙2.0系统。'
    ],
    signals: { behaviorChange: '货损反弹', freqChange: '半月一次', churnRisk: '中', renewalSignal: '待定', focus: '品质' },
    actions: { direction: '品质复盘', valuePoints: ['全链路透明', '响应速度'], nextSteps: ['现场系统演示', '更新SOP规范'] },
    lastVisit: '2024-11-28',
    nextMilestone: '2024-12-08 技术升级评审'
  }
];

export const MOCK_PROSPECT_CUSTOMERS: ProspectCustomer[] = [
  {
    id: 'p1',
    name: '小米通讯（南京分部）',
    address: '江苏省南京市建邺区江东中路373号',
    industry: '消费电子',
    size: '10000+',
    needIntensity: '强',
    reason: '业务扩张：近期在华东区域新建3000家线下体验店，存在送装一体缺口。',
    background: '小米正推动“全渠道融合”，要求线上线下库存“一盘货”管理，目前正在评估多方物流履约能力。',
    scenarios: ['下沉市场送装一体', '逆向物流回收', '仓配一体化'],
    painPoints: {
      typical: ['末端配送触达弱', '安装服务不标准'],
      focus: ['配送覆盖深度', '送装一体成功率'],
      concerns: ['服务成本控制', '系统对接复杂度']
    },
    solutions: [
      { title: '送装一体全域覆盖方案', desc: '利用京东211时效及自营装机师团队，解决最后一公里难题。', benefits: ['送装同步', '覆盖全国'], stats: 'NPS提升30%', icon: '📱' }
    ],
    cases: [
      { 
        company: '华为终端', 
        industry: '通讯设备', 
        desc: '采用京东送装一体服务后，偏远城镇覆盖率提升100%，极大地提升了用户满意度。', 
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' 
      }
    ],
    nextSteps: ['提交覆盖率报告', '预约参观亚洲一号仓']
  },
  {
    id: 'p2',
    name: '三只松鼠',
    address: '安徽省芜湖市弋江区九华南路152号',
    industry: '休闲零食',
    size: '5000+',
    needIntensity: '强',
    reason: '战略调整：从纯线上向全渠道转型，急需解决多仓库库存割裂与效期管理问题。',
    background: '零食行业SKU多且效期短，对周转率要求极高，传统分销模式导致库存积压严重。',
    scenarios: ['BC同仓一体化', '短保产品预警控制', '智能补货预测'],
    painPoints: {
      typical: ['库存积压严重', '线上线下渠道冲突'],
      focus: ['一盘货管理', '效期自动追踪'],
      concerns: ['系统迁移风险', '履约成本上涨']
    },
    solutions: [
      { title: '一盘货智慧供应链', desc: '打通线上线下所有渠道库存，实现全局动态调拨与效期管控。', benefits: ['零库存积压', '效期实时监控'], stats: '周转天数降低15天', icon: '🐿️' }
    ],
    cases: [
      { 
        company: '百草味', 
        industry: '休闲食品', 
        desc: '实施“一盘货”战略后，全渠道缺货率从12%降至1.5%，库存周转效率提升3倍。', 
        image: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?q=80&w=800&auto=format&fit=crop' 
      }
    ],
    nextSteps: ['仓库实地考察', '系统Demo演示']
  }
];
