<template>
  <div class="demo">
    <div class="title">
      <h2>工单提醒</h2>
      <span>查看更多</span>
    </div>
    <div class="cont">
      <div class="cards" v-for="(item, index) in cardList" :key="index">
        <!-- <el-icon :size="32"> <component :is="item.icon" /> </el-icon> -->
        <el-icon :size="32" :color="item.color"> <component :is="item.icon" /> </el-icon>
        <h3>{{ item.title }}</h3>
        <p>{{ item.des }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>

const cardList = [
  {
    icon: 'Checked',
    color: '#67C23A',
    title: "工单服务",
    des: "工单服务是一套以工单为核心的服务管理模式，工单是记录用户员工提出的问题、需求、投诉或故障的标准化表单，包含请求人信息、问题描述、优先级、处理部门人、处理进度、处理结果等关键信息。",
  },
  {
    icon: 'PhoneFilled',
    color: '#E6A23C',
    title: "在线咨询",
    des: "在线咨询服务提供 7×12 小时实时沟通渠道，用户可通过文字、图片、文件等形式提交疑问，由专业客服团队快速响应，解决产品使用、业务办理、故障排查等各类问题，支持聊天记录回溯与问题闭环跟踪。",
  },
  {
    icon: 'HelpFilled',
    color: 'blue',
    title: "帮助中心",
    des: "帮助中心整合了产品手册、操作指南、常见问题、视频教程等自助服务资源，按业务场景分类检索，用户可通过关键词搜索快速获取解决方案，同时支持用户反馈功能，持续优化帮助内容覆盖范围。",
  },
  {
    icon: 'Ticket',
    color: '#F56C6C',
    title: "售后工单",
    des: "售后工单专注于处理用户购买产品后的维修、退换、升级等需求，支持按售后类型（质量问题、功能故障、服务升级）分类提交，包含物流跟踪、维修进度查询、售后评价等功能，保障售后流程透明可追溯。",
  },
  {
    icon: 'Comment',
    color: 'purple',
    title: "专属客服",
    des: "专属客服服务为 VIP 用户提供一对一专属对接，配备资深服务顾问，提供定制化解决方案、优先处理权限、定期业务回访等增值服务，支持个性化需求定制，满足企业级用户的复杂业务场景需求。",
  },
  {
    icon: 'BellFilled',
    color: 'yellow',
    title: "消息通知",
    des: "消息通知服务支持工单状态变更、咨询回复、售后进度、系统公告等各类信息推送，用户可自主选择通知渠道（站内信、短信、邮件），设置通知频率与免打扰时段，确保关键信息及时触达且不打扰用户。",
  },
  {
    icon: 'Platform',
    color: 'cyan',
    title: "数据报表",
    des: "数据报表服务为企业用户提供工单处理效率、咨询量趋势、用户满意度等多维度数据统计，支持自定义报表周期、数据导出、可视化图表展示，帮助企业分析服务瓶颈，优化服务资源配置与流程效率。",
  },
];
</script>

<style lang="scss" scoped>
.demo {
  // width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;

  .title {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;

    h2 {
      flex: 1;
      margin: 0;
    }
  }

  .cont {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .cards {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 200px;

      .el-icon {
        font-size: 32px;
      }

      h3,
      p {
        margin: 0;
      }

      p {
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
