<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo">尊峰环保监管系统</div>
      <div class="header-center">
        <div class="date-weather">
          {{ formattedDate }} | {{ weatherInfo }}
        </div>
      </div>
      <div class="header-right">
        <el-input 
          v-model="searchQuery" 
          placeholder="🔍 搜索用户、角色或权限..." 
          class="search-box"
        />
        <div class="user-info" @click="showUserMenu = !showUserMenu">
          <span>👤 张三-总部监管部</span>
          <el-dropdown v-if="showUserMenu" placement="bottom-end">
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-button 
          icon="Setting" 
          circle 
          class="settings-btn"
          @click="handleSettingsClick"
        />
      </div>
    </header>
    
    <!-- 页面导航 -->
    <div class="page-nav">
      <el-button 
        class="back-btn" 
        @click="handleBackClick"
        icon="ArrowLeft"
      >
        返回首页
      </el-button>
      <div class="page-title">权限管理系统</div>
    </div>
    
    <!-- 主内容区 -->
    <main class="main-container">
      <!-- 左侧菜单 -->
      <aside class="menu-panel">
        <el-card class="data-panel panel-blue">
          <div class="panel-title">功能菜单</div>
          <div 
            class="menu-item" 
            :class="{ active: activeMenu === menu.id }"
            v-for="menu in menus" 
            :key="menu.id"
            @click="activeMenu = menu.id"
          >
            <div class="menu-icon">{{ menu.icon }}</div>
            <span>{{ menu.name }}</span>
          </div>
        </el-card>
        
        <el-card class="data-panel panel-purple">
          <div class="panel-title">用户列表</div>
          <div class="user-list">
            <div 
              class="user-item" 
              :class="{ active: activeUserId === user.id }"
              v-for="user in users" 
              :key="user.id"
              @click="selectUser(user)"
            >
              <div class="user-info-small">
                <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                <div class="user-details">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-role">{{ user.role }}</div>
                </div>
              </div>
              <div class="user-status" :class="user.status ? 'status-online' : 'status-offline'"></div>
            </div>
          </div>
        </el-card>
      </aside>
      
      <!-- 右侧内容区 -->
      <section class="content-panel">
        <el-card class="data-panel panel-green">
          <div class="content-header">
            <div class="content-title">{{ activeUser.name }} - 权限管理</div>
            <div class="action-buttons">
              <el-button class="action-btn" @click="handleAddUser" icon="Plus">
                添加用户
              </el-button>
              <el-button class="action-btn" @click="handleEditUser" icon="Edit">
                编辑用户
              </el-button>
              <el-button class="action-btn red" @click="handleDeleteUser" icon="Delete">
                删除用户
              </el-button>
            </div>
          </div>
          
          <div class="user-detail-panel">
            <div class="detail-section">
              <div class="detail-title">用户信息</div>
              <div class="detail-content">{{ activeUser.name }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-title">所属部门</div>
              <div class="detail-content">{{ activeUser.department }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-title">用户角色</div>
              <div class="detail-content">{{ activeUser.role }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-title">账号状态</div>
              <div class="detail-content">{{ activeUser.accountStatus }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-title">最后登录</div>
              <div class="detail-content">{{ activeUser.lastLogin }}</div>
            </div>
            <div class="detail-section">
              <div class="detail-title">登录IP</div>
              <div class="detail-content">{{ activeUser.loginIp }}</div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">分配角色</label>
            <el-select 
              v-model="activeUser.role" 
              class="form-select"
              @change="handleRoleChange"
            >
              <el-option label="系统管理员" value="系统管理员"></el-option>
              <el-option label="站点管理员" value="站点管理员"></el-option>
              <el-option label="操作员" value="操作员"></el-option>
              <el-option label="巡检员" value="巡检员"></el-option>
              <el-option label="只读用户" value="只读用户"></el-option>
            </el-select>
          </div>
          
          <div class="panel-title" style="margin-top: 20px;">权限分配</div>
          <div class="permission-tree">
            <el-tree
              :data="permissionData"
              :props="treeProps"
              show-checkbox
              node-key="id"
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="[1]"
              @check="handlePermissionChange"
            ></el-tree>
          </div>
          
          <div class="action-buttons" style="margin-top: 20px; justify-content: flex-end;">
            <el-button class="action-btn" @click="handleCancel">取消</el-button>
            <el-button 
              class="action-btn save-btn" 
              @click="handleSavePermissions"
            >
              保存权限
            </el-button>
          </div>
        </el-card>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 响应式数据
const searchQuery = ref('');
const showUserMenu = ref(false);
const activeMenu = ref(1);
const activeUserId = ref(1);
const activeUser = ref({});
const users = ref([]);
const menus = ref([]);
const permissionData = ref([]);
const defaultCheckedKeys = ref([]);
const weatherInfo = ref('青海 晴 12℃ 无预警');

// 树形结构配置
const treeProps = {
  children: 'children',
  label: 'name'
};

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[date.getDay()];
  return `${year}年${month}月${day}日 ${weekday}`;
});

// 初始化数据
onMounted(() => {
  // 初始化菜单数据
  menus.value = [
    { id: 1, name: '用户管理', icon: '👥' },
    { id: 2, name: '角色管理', icon: '🛡️' },
    { id: 3, name: '权限管理', icon: '🔐' },
    { id: 4, name: '权限日志', icon: '📊' }
  ];
  
  // 初始化用户数据
  users.value = [
    { 
      id: 1, 
      name: '张三', 
      role: '系统管理员', 
      department: '总部监管部',
      accountStatus: '正常',
      lastLogin: '2024-10-29 14:30:25',
      loginIp: '192.168.1.100',
      status: true
    },
    { 
      id: 2, 
      name: '李四', 
      role: '站点管理员', 
      department: '青海站点',
      accountStatus: '正常',
      lastLogin: '2024-10-28 09:15:42',
      loginIp: '192.168.1.101',
      status: true
    },
    { 
      id: 3, 
      name: '王五', 
      role: '操作员', 
      department: '甘肃站点',
      accountStatus: '正常',
      lastLogin: '2024-10-27 16:42:18',
      loginIp: '192.168.1.102',
      status: false
    },
    { 
      id: 4, 
      name: '赵六', 
      role: '巡检员', 
      department: '四川站点',
      accountStatus: '正常',
      lastLogin: '2024-10-29 11:05:33',
      loginIp: '192.168.1.103',
      status: true
    }
  ];
  
  // 初始化权限数据
  permissionData.value = [
    {
      id: 1,
      name: '系统管理',
      children: [
        { id: 11, name: '用户管理' },
        { id: 12, name: '角色管理' },
        { id: 13, name: '权限管理' },
        { id: 14, name: '系统设置' }
      ]
    },
    {
      id: 2,
      name: '站点管理',
      children: [
        { id: 21, name: '站点信息查看' },
        { id: 22, name: '站点信息编辑' },
        { id: 23, name: '站点添加/删除' }
      ]
    },
    {
      id: 3,
      name: '数据管理',
      children: [
        { id: 31, name: '数据查看' },
        { id: 32, name: '数据导出' },
        { id: 33, name: '数据编辑' },
        { id: 34, name: '数据删除' }
      ]
    },
    {
      id: 4,
      name: '报警管理',
      children: [
        { id: 41, name: '报警查看' },
        { id: 42, name: '报警处理' },
        { id: 43, name: '报警设置' }
      ]
    }
  ];
  
  // 默认选择第一个用户
  selectUser(users.value[0]);
});

// 方法
const selectUser = (user) => {
  activeUser.value = { ...user };
  activeUserId.value = user.id;
  
  // 根据用户角色设置默认权限
  setDefaultPermissionsByRole(user.role);
};

const setDefaultPermissionsByRole = (role) => {
  // 清空之前的选择
  defaultCheckedKeys.value = [];
  
  // 根据角色设置不同的默认权限
  switch(role) {
    case '系统管理员':
      defaultCheckedKeys.value = [11, 12, 13, 21, 22, 31, 32, 41, 42];
      break;
    case '站点管理员':
      defaultCheckedKeys.value = [21, 22, 31, 32, 41, 42];
      break;
    case '操作员':
      defaultCheckedKeys.value = [21, 31, 41];
      break;
    case '巡检员':
      defaultCheckedKeys.value = [21, 31, 41];
      break;
    case '只读用户':
      defaultCheckedKeys.value = [21, 31, 41];
      break;
    default:
      defaultCheckedKeys.value = [];
  }
};

const handleRoleChange = (role) => {
  // 当角色改变时，更新默认权限
  setDefaultPermissionsByRole(role);
};

const handlePermissionChange = (checkedKeys) => {
  console.log('权限变更:', checkedKeys);
  // 这里可以处理权限变更的逻辑
};

const handleAddUser = () => {
  // 添加用户逻辑
  ElMessage.info('打开添加用户表单');
};

const handleEditUser = () => {
  // 编辑用户逻辑
  ElMessage.info('打开编辑用户表单');
};

const handleDeleteUser = () => {
  // 删除用户逻辑
  ElMessageBox.confirm(
    `确定要删除用户 ${activeUser.value.name} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 执行删除操作
    users.value = users.value.filter(user => user.id !== activeUserId.value);
    if (users.value.length > 0) {
      selectUser(users.value[0]);
    }
    ElMessage.success('用户已删除');
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除');
  });
};

const handleSavePermissions = () => {
  // 保存权限逻辑
  ElMessage.success('权限设置已保存');
};

const handleCancel = () => {
  // 取消编辑，重置权限
  setDefaultPermissionsByRole(activeUser.value.role);
  ElMessage.info('已取消编辑');
};

const handleBackClick = () => {
  // 返回首页逻辑
  ElMessage.info('返回首页');
};

const handleSettingsClick = () => {
  // 设置按钮点击逻辑
  ElMessage.info('打开设置面板');
};

// 导入Element Plus组件
import { ElMessage, ElMessageBox, ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElInput, ElSelect, ElOption, ElTree } from 'element-plus';
</script>

<style lang="scss" scoped>
// 全局样式
.app-container {
  background: linear-gradient(135deg, #0c1e3a 0%, #14294a 100%);
  color: #e0e0e0;
  min-height: 100vh;
  overflow-x: hidden;
}

// 顶部导航栏
.header {
  background: rgba(12, 30, 58, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(64, 140, 255, 0.2);
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  position: relative;
  z-index: 100;

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #e0e0e0;
    letter-spacing: 1px;
    display: flex;
    align-items: center;

    &::before {
      content: "🌍";
      margin-right: 8px;
      font-size: 18px;
    }
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 20px;

    .date-weather {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(64, 140, 255, 0.3);
      border-radius: 20px;
      padding: 8px 16px;
      color: #e0e0e0;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 15px;

    .search-box {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(64, 140, 255, 0.3);
      border-radius: 20px;
      padding: 8px 16px;
      width: 280px;
      color: #e0e0e0;
      font-size: 14px;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: rgba(64, 140, 255, 0.6);
        box-shadow: 0 0 10px rgba(64, 140, 255, 0.2);
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(64, 140, 255, 0.1);
      }
    }

    .settings-btn {
      background: none;
      border: none;
      color: #e0e0e0;
      font-size: 18px;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(64, 140, 255, 0.1);
        transform: rotate(30deg);
      }
    }
  }
}

// 页面导航
.page-nav {
  background: rgba(18, 36, 64, 0.7);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(64, 140, 255, 0.2);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 20px;

  .back-btn {
    background: rgba(64, 140, 255, 0.2);
    border: 1px solid rgba(64, 140, 255, 0.5);
    border-radius: 6px;
    padding: 8px 16px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: rgba(64, 140, 255, 0.4);
    }
  }

  .page-title {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
  }
}

// 主内容区
.main-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  padding: 16px;
  height: calc(100vh - 124px);
}

// 数据面板通用样式
.data-panel {
  background: rgba(18, 36, 64, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(64, 140, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: rgba(64, 140, 255, 0.4);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
}

.panel-red {
  border-color: rgba(255, 80, 80, 0.3);
}

.panel-green {
  border-color: rgba(80, 255, 160, 0.3);
}

.panel-blue {
  border-color: rgba(80, 160, 255, 0.3);
}

.panel-purple {
  border-color: rgba(160, 100, 255, 0.3);
}

.panel-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #e0e0e0;
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  }
}

.panel-red .panel-title::before {
  background: rgba(255, 80, 80, 0.8);
  box-shadow: 0 0 6px rgba(255, 80, 80, 0.6);
}

.panel-green .panel-title::before {
  background: rgba(80, 255, 160, 0.8);
  box-shadow: 0 0 6px rgba(80, 255, 160, 0.6);
}

.panel-blue .panel-title::before {
  background: rgba(80, 160, 255, 0.8);
  box-shadow: 0 0 6px rgba(80, 160, 255, 0.6);
}

.panel-purple .panel-title::before {
  background: rgba(160, 100, 255, 0.8);
  box-shadow: 0 0 6px rgba(160, 100, 255, 0.6);
}

// 左侧菜单
.menu-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: rgba(64, 140, 255, 0.1);
  }

  &.active {
    background: rgba(64, 140, 255, 0.2);
    border: 1px solid rgba(64, 140, 255, 0.5);
  }
}

.menu-icon {
  font-size: 18px;
}

// 用户列表
.user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(64, 140, 255, 0.1);
  }

  &.active {
    background: rgba(64, 140, 255, 0.2);
    border: 1px solid rgba(64, 140, 255, 0.5);
  }
}

.user-info-small {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(80, 160, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.user-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-online {
  background: rgba(80, 255, 160, 0.8);
  box-shadow: 0 0 5px rgba(80, 255, 160, 0.6);
}

.status-offline {
  background: rgba(255, 255, 255, 0.3);
}

// 权限管理内容区
.content-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: rgba(64, 140, 255, 0.2);
  border: 1px solid rgba(64, 140, 255, 0.5);
  border-radius: 6px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(64, 140, 255, 0.4);
  }

  &.red {
    background: rgba(255, 80, 80, 0.2);
    border: 1px solid rgba(255, 80, 80, 0.5);

    &:hover {
      background: rgba(255, 80, 80, 0.4);
    }
  }

  &.save-btn {
    background: rgba(80, 255, 160, 0.2);
    border: 1px solid rgba(80, 255, 160, 0.5);

    &:hover {
      background: rgba(80, 255, 160, 0.4);
    }
  }
}

// 权限树
.permission-tree {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;

  ::v-deep .el-tree {
    background: transparent;
  }

  ::v-deep .el-tree-node__content {
    color: #e0e0e0;
    height: 36px;
  }

  ::v-deep .el-tree-node__label {
    &:hover {
      color: #80a0ff;
    }
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #408cff;
    border-color: #408cff;
  }

  ::v-deep .el-checkbox__inner {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(64, 140, 255, 0.5);
  }
}

// 用户详情
.user-detail-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 16px;
}

.detail-title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.detail-content {
  font-size: 16px;
  font-weight: bold;
}

// 表单元素
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.form-input, .form-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(64, 140, 255, 0.3);
  border-radius: 6px;
  padding: 10px 12px;
  color: #e0e0e0;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(64, 140, 255, 0.6);
    box-shadow: 0 0 5px rgba(64, 140, 255, 0.2);
  }
}

::v-deep .el-select {
  .el-input {
    .el-input__inner {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(64, 140, 255, 0.3);
      color: #e0e0e0;

      &:focus {
        border-color: rgba(64, 140, 255, 0.6);
        box-shadow: 0 0 5px rgba(64, 140, 255, 0.2);
      }
    }
  }

  .el-select-dropdown {
    background: rgba(18, 36, 64, 0.9);
    border: 1px solid rgba(64, 140, 255, 0.3);

    .el-select-dropdown__item {
      color: #e0e0e0;

      &:hover {
        background: rgba(64, 140, 255, 0.2);
      }

      &.selected {
        background: rgba(64, 140, 255, 0.3);
      }
    }
  }
}

// 动画效果
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(64, 140, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(64, 140, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(64, 140, 255, 0.5); }
}
</style>