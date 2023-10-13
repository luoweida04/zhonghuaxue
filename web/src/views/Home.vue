<template>
  <div id="app">
    <el-row class="top">
      <el-col :span="21">
        <img src="../assets/后台logo.png" alt="" class="logo" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">
        <div class="leftBar">
          <el-button
            class="leftBtn"
            v-for="(item, index) in barTitles"
            :key="index"
            @click="changeBar(index)"
            :style="
              clickedIndex == index
                ? 'background-color: rgba(7, 193, 96, 0.35)'
                : ''
            "
            >{{ item }}</el-button
          >
        </div>
      </el-col>
      <el-col :span="21" class="main">
        <div
          class="mainTop"
          v-show="!userTable2 && !rateResultDetail && !rateResultStatistics"
        >
          <el-input
            v-model="searchInput"
            placeholder="请输入搜索关键词"
          ></el-input>
          <div class="two">
            <div class="image" @click="searchByKey">
              <img src="../assets/search.png" alt="" />
            </div>
            <el-button
              class="newProj"
              @click="showNewProjDialog"
              v-show="clickedIndex == 0"
              >发布评分项目</el-button
            >
            <el-button
              class="newProj"
              @click="newRatedDialog = true"
              v-show="clickedIndex == 2"
              >添加被评分人</el-button
            >
            <el-button
              class="newProj"
              @click="rateResultStatistics = true"
              v-show="clickedIndex == 3"
              >统计分析</el-button
            >
            <span>
              <el-select
                v-model="alarmMode2Season"
                v-show="clickedIndex == 4 && warningMode"
                placeholder="请选择季度"
                style="position: absolute; right: 300px; width: 300px"
              >
                <el-option label="第一季度" :value="0"></el-option>
                <el-option label="第二季度" :value="1"></el-option>
                <el-option label="第三季度" :value="2"></el-option>
                <el-option label="第四季度" :value="3"></el-option>
              </el-select>
              <el-button
                class="newProj"
                @click="changeWarningMode"
                v-show="clickedIndex == 4"
                >切换预警模式</el-button
              >
              <el-button
                class="newProj"
                @click="showWarningDialog"
                v-show="clickedIndex == 4 && !warningMode"
                style="right: 150px"
                >预警值设置</el-button
              >
            </span>
            <el-button
              class="newProj"
              @click="showBgDialog"
              v-show="clickedIndex == 5"
              style="width: 150px"
              >添加</el-button
            >
          </div>
        </div>
        <!-- 项目管理 -->
        <el-table
          :data="projManage"
          v-loading="loadingProj"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="{ padding: '6px' }"
          style="width: 100%"
          v-show="clickedIndex == 0"
        >
          <el-table-column
            label="序号"
            type="index"
            width="100px"
          ></el-table-column>
          <el-table-column prop="name" label="评分项目名称" width="250px">
          </el-table-column>
          <el-table-column prop="department" label="部门"> </el-table-column>
          <el-table-column prop="start" label="开始时间"> </el-table-column>
          <el-table-column prop="end" label="结束时间"> </el-table-column>
          <el-table-column
            prop="enable"
            label="状态"
            :formatter="(row) => (row.enable ? '进行中' : '已结束')"
          >
          </el-table-column>
          <el-table-column label="操作" width="290px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="lookProject(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                @click="closeOrOpen(scope.$index, scope.row.enable)"
                >{{ scope.row.enable ? "关闭" : "开启" }}</el-button
              >
              <el-button
                size="mini"
                @click="copyProject(scope.$index, scope.row)"
                >复制</el-button
              >
              <el-button
                size="mini"
                @click="loadEditProject(scope.$index, scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 用户管理 -->
        <el-table
          :data="userManage"
          v-loading="loadingUsers"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="{ padding: '6px' }"
          style="width: 100%"
          v-show="clickedIndex == 1 && userTable2 == false"
        >
          <el-table-column prop="username" label="员工姓名" width="250px">
          </el-table-column>
          <el-table-column prop="department" label="部门"> </el-table-column>
          <el-table-column
            prop="sex"
            :formatter="(row) => (row.sex == 0 ? '男' : '女')"
            label="性别"
          >
          </el-table-column>
          <el-table-column prop="phone_number" label="电话"> </el-table-column>
          <el-table-column prop="oper" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button size="mini" @click="userLook(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button size="mini" @click="userDel(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          class="userTable2"
          v-show="clickedIndex == 1 && userTable2"
          style="height: calc(82%)"
        >
          <div class="head">
            <div class="title">{{ userManage2.project_name }}</div>
            <div class="name">评分人：{{ userManage2.rate_men }}</div>
            <div class="department">部门：{{ userManage2.department }}</div>
            <div class="season">季度：{{ userManage2.seasonStr }}</div>
            <div class="avgScore">
              平均分：<span style="color: #ff9000">{{ userManage2.avg }}</span
              >分
            </div>
          </div>
          <el-table
            :data="userManage2.arr"
            v-loading="loading"
            height="calc(100%)"
            :row-class-name="onTableRowClassName"
            :cell-style="orangeColor"
            :row-style="{ height: '0px' }"
            style="width: 100%"
          >
            <el-table-column prop="ratee_name" label="被评分人" width="250px">
            </el-table-column>
            <el-table-column prop="group_name" label="部门"> </el-table-column>
            <el-table-column
              prop="created_at"
              label="评分时间"
              :formatter="(row) => dateFormatter(row.created_at)"
            >
            </el-table-column>
            <el-table-column prop="value" label="评分"> </el-table-column>
          </el-table>
        </div>
        <!-- 被评分人 -->
        <el-table
          :data="ratedMen"
          v-loading="loadingRatee"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="{ padding: '6px' }"
          style="width: 100%"
          v-show="clickedIndex == 2"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            :formatter="(row) => (row.sex == 0 ? '男' : '女')"
            width="250px"
          >
          </el-table-column>
          <el-table-column prop="background" label="政治面貌">
          </el-table-column>
          <el-table-column prop="position" label="职位"> </el-table-column>
          <el-table-column prop="phone_number" label="电话"> </el-table-column>
          <el-table-column prop="oper" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="lookRateeRecords(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button size="mini" @click="ratedDel(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 评分结果 -->
        <el-table
          :data="rateResultTable"
          v-loading="loadingRecords"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="{ padding: '6px' }"
          style="width: 100%"
          v-show="
            clickedIndex == 3 && !rateResultDetail && !rateResultStatistics
          "
        >
          <el-table-column
            type="index"
            label="序号"
            width="150px"
          ></el-table-column>
          <el-table-column prop="name" label="评分项目名称" width="250px">
          </el-table-column>
          <el-table-column prop="department" label="部门"> </el-table-column>
          <el-table-column prop="participants" label="已参与人数">
          </el-table-column>
          <el-table-column
            prop="enable"
            label="状态"
            :formatter="(row) => (row.enable ? '进行中' : '已结束')"
          >
          </el-table-column>
          <el-table-column prop="start" label="创建时间"> </el-table-column>
          <el-table-column prop="oper" label="操作" width="220px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="showRateResultDetail(scope.$index, scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          class="resultTable2"
          style="height: calc(82%)"
          v-show="
            clickedIndex == 3 && rateResultDetail && !rateResultStatistics
          "
        >
          <div class="head">
            <div class="title">{{ rateResultDetailTable.project_name }}</div>
            <div class="season">
              季度：{{ rateResultDetailTable.seasonStr }}
            </div>
            <div class="count">
              已参与评分人数：<span style="color: #ff9000">{{
                rateResultDetailTable.participants
              }}</span
              >人
            </div>
          </div>
          <el-table
            :data="rateResultDetailTable.arr"
            height="calc(100%)"
            v-loading="loading"
            :row-class-name="onTableRowClassName"
            :row-style="{ height: '0px' }"
            :cell-style="orangeColor"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <el-table-column prop="name" label="员工姓名" width="150px">
            </el-table-column>
            <el-table-column prop="department" label="部门"> </el-table-column>
            <el-table-column prop="s0" label="第一季度"> </el-table-column>
            <el-table-column prop="s1" label="第二季度"> </el-table-column>
            <el-table-column prop="s2" label="第三季度"> </el-table-column>
            <el-table-column prop="s3" label="第四季度"> </el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div
                  :style="
                    'color: ' +
                    (scope.row.status === '预警'
                      ? '#EF2B00;!important'
                      : '#575757;!important')
                  "
                >
                  <!-- {{ scope.row.status ? "预警" : "正常" }} -->
                  {{ scope.row.status }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showRateResultDetail2(scope.$index, scope.row)"
                  >查看明细</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          class="statistic"
          v-show="clickedIndex == 3 && rateResultStatistics"
        >
          <div class="head">
            <div class="selects">
              <el-select
                v-model="statisticsFormTop.group_id"
                placeholder="请选择部门"
              >
                <el-option
                  v-for="(item, i) in allGroups"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-model="statisticsFormTop.year"
                placeholder="请选择年份"
              >
                <el-option
                  v-for="(item, i) in yearOptions"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
                <!-- <el-option label="2022" :value="2022"></el-option>
                <el-option label="2023" :value="2023"></el-option>
                <el-option label="2024" :value="2024"></el-option>
                <el-option label="2025" :value="2025"></el-option>
                <el-option label="2026" :value="2026"></el-option>
                <el-option label="2027" :value="2027"></el-option>
                <el-option label="2028" :value="2028"></el-option>
                <el-option label="2029" :value="2029"></el-option>
                <el-option label="2030" :value="2030"></el-option> -->
              </el-select>
              <el-select
                v-model="statisticsFormTop.season"
                placeholder="请选择季度"
              >
                <el-option label="第一季度" :value="0"></el-option>
                <el-option label="第二季度" :value="1"></el-option>
                <el-option label="第三季度" :value="2"></el-option>
                <el-option label="第四季度" :value="3"></el-option>
              </el-select>
            </div>
            <el-button class="reset" @click="resetFormTop">重置</el-button>
            <el-button @click="analysisTop">确定</el-button>
          </div>
          <div class="middle">
            <div>
              <div class="title">
                <div class="block"></div>
                <div class="text">排行统计</div>
              </div>
              <div id="columnDiagram" class="box"></div>
            </div>
            <div>
              <div class="title">
                <div class="block"></div>
                <div class="text">分数占比</div>
              </div>
              <div id="pieDiagram" class="box"></div>
            </div>
          </div>
          <div class="bottom">
            <div class="optionBox">
              <div class="selects">
                <el-select
                  v-model="statisticsFormBottom.group_id"
                  placeholder="请选择部门"
                >
                  <el-option
                    v-for="(item, i) in allGroups"
                    :key="i"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="statisticsFormBottom.year"
                  placeholder="请选择年份"
                >
                  <!-- <el-option label="2022" :value="2022"></el-option>
                  <el-option label="2023" :value="2023"></el-option> -->
                  <el-option
                    v-for="(item, i) in yearOptions"
                    :key="i"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="statisticsFormBottom.votee"
                  placeholder="请选择被评分人"
                >
                  <el-option
                    v-for="(item, i) in allRatees"
                    :key="i"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <el-button class="reset" @click="resetFormBottom">重置</el-button>
              <el-button @click="analysisBottom">确定</el-button>
            </div>
            <div class="title">
              <div class="block"></div>
              <div class="text">季度对比统计</div>
            </div>
            <div id="lineDiagram" class="box"></div>
          </div>
        </div>
        <!-- 预警管理 -->
        <el-table
          :data="warningManage"
          v-loading="loadingAlarm"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="redColor"
          style="width: 100%"
          v-show="clickedIndex == 4"
        >
          <el-table-column
            prop="ratee_name"
            label="姓名"
            width="160px"
          ></el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            :formatter="(row) => (row.sex == 0 ? '男' : '女')"
            width="100px"
          >
          </el-table-column>
          <el-table-column prop="background" label="政治面貌">
          </el-table-column>
          <el-table-column prop="position" label="职位" width="100">
          </el-table-column>
          <el-table-column prop="phone_number" label="电话"> </el-table-column>
          <el-table-column prop="project_name" label="评分项目" width="280">
          </el-table-column>
          <el-table-column prop="avg_rating" label="平均分"> </el-table-column>
        </el-table>
        <!-- 后台设置 -->
        <el-table
          :data="bgSetting"
          v-loading="loadingAdmin"
          height="calc(82%)"
          :row-class-name="onTableRowClassName"
          :row-style="{ height: '0px' }"
          :cell-style="{ padding: '6px' }"
          style="width: 100%"
          v-show="clickedIndex == 5"
        >
          <el-table-column
            prop="email"
            label="账号"
            width="250px"
          ></el-table-column>
          <el-table-column prop="region" label="地区"> </el-table-column>
          <el-table-column prop="department" label="部门" width="180">
          </el-table-column>
          <el-table-column prop="role" label="角色"> </el-table-column>
          <el-table-column prop="oper" label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" @click="bgEdit(scope.$index, scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" @click="bgDel(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-show="!rateResultStatistics">
          <el-button
            v-show="userTable2 && clickedIndex == 1"
            class="userReturn"
            @click="userReturn"
            >返回</el-button
          >
          <el-button
            v-show="rateResultDetail && clickedIndex == 3"
            class="userReturn"
            @click="rateResultReturn"
            >返回</el-button
          >
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :pager-count="7"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableItemCount"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- 项目管理 -->
    <el-dialog
      title=""
      :visible.sync="newProjDialog"
      width="640px"
      :close-on-click-modal="false"
      class="newProjDialog"
      :show-close="false"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">添加评分项目</div>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="newProjForm"
          label-width="80px"
          label-position="left"
        >
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="年份" style="width: 250px">
              <el-select v-model="newProjForm.year" placeholder="请选择年份">
                <el-option
                  v-for="(item, i) in yearOptions"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="季度" style="margin-left: 20px; width: 250px">
              <el-select v-model="newProjForm.season" placeholder="请选择季度">
                <el-option label="第一季度" :value="0"></el-option>
                <el-option label="第二季度" :value="1"></el-option>
                <el-option label="第三季度" :value="2"></el-option>
                <el-option label="第四季度" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="项目名称" style="width: 250px">
              <el-input
                v-model="newProjForm.name"
                placeholder="请输入项目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" style="width: 250px">
              <el-select
                v-model="newProjForm.group_id"
                placeholder="请选择部门"
                style="width: 170px"
              >
                <el-option
                  v-for="(item, i) in allGroups"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="评分时间">
            <el-date-picker
              v-model="newProjForm.start"
              type="datetime"
              placeholder="请选择开始时间"
              class="datePicker"
            >
            </el-date-picker>
            <span style="margin: auto 23px">至</span>
            <el-date-picker
              v-model="newProjForm.end"
              type="datetime"
              placeholder="请选择结束时间"
              class="datePicker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="被评分人">
            <el-select
              v-model="newProjForm.attended_ratee_ids"
              placeholder="请选择被评分人(多选)"
              multiple
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in ratedMen"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分组织">
            <el-select
              v-model="newProjForm.attended_group_ids"
              placeholder="请选择参与评分的组织"
              multiple
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in allGroups"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="closeNewProjDialog1"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >取 消</el-button
        >
        <el-button type="primary" @click="addNewProject">添 加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="newProjDialog3"
      width="640px"
      :close-on-click-modal="false"
      class="newProjDialog"
      :show-close="false"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">编辑评分项目</div>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="changeProjForm"
          label-width="80px"
          label-position="left"
        >
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="年份" style="width: 250px">
              <el-select v-model="changeProjForm.year" placeholder="请选择年份">
                <el-option
                  v-for="(item, i) in yearOptions"
                  :key="i"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="季度" style="margin-left: 20px; width: 250px">
              <el-select
                v-model="changeProjForm.season"
                placeholder="请选择季度"
              >
                <el-option label="第一季度" :value="0"></el-option>
                <el-option label="第二季度" :value="1"></el-option>
                <el-option label="第三季度" :value="2"></el-option>
                <el-option label="第四季度" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="项目名称" style="width: 250px">
              <el-input
                v-model="changeProjForm.name"
                placeholder="请输入项目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" style="width: 250px">
              <el-select
                disabled
                v-model="changeProjForm.own_group_id"
                placeholder="请选择部门"
                style="width: 170px"
              >
                <el-option
                  v-for="(item, i) in allGroups"
                  :key="i"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="评分时间">
            <el-date-picker
              v-model="changeProjForm.start"
              type="datetime"
              placeholder="请选择开始时间"
              class="datePicker"
            >
            </el-date-picker>
            <span style="margin: auto 23px">至</span>
            <el-date-picker
              v-model="changeProjForm.end"
              type="datetime"
              placeholder="请选择结束时间"
              class="datePicker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="被评分人">
            <el-select
              v-model="changeProjForm.attended_ratee_ids"
              placeholder="请选择被评分人(多选)"
              multiple
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in ratedMen"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分组织">
            <el-select
              v-model="changeProjForm.attended_group_ids"
              placeholder="请选择参与评分的组织"
              multiple
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in allGroups"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="closeNewProjDialog3"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >取 消</el-button
        >
        <el-button type="primary" @click="updateProject">确 认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="lookProjectFlag"
      width="640px"
      :close-on-click-modal="false"
      class="newProjDialog"
      :show-close="false"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">查看评分项目</div>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="checkProjForm"
          label-width="80px"
          label-position="left"
        >
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="年份" style="width: 250px">
              <el-input
                v-model="checkProjForm.year"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="季度" style="margin-left: 20px; width: 250px">
              <el-input
                v-model="checkProjForm.season"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="项目名称" style="width: 250px">
              <el-input
                v-model="checkProjForm.name"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="部门" style="width: 250px">
              <el-input
                v-model="checkProjForm.department"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="评分时间">
            <el-input
              v-model="checkProjForm.start"
              :disabled="true"
              style="width: 220px"
            ></el-input>
            <span style="margin: auto 23px">至</span>
            <el-input
              v-model="checkProjForm.end"
              :disabled="true"
              style="width: 220px"
            ></el-input>
          </el-form-item>
          <el-form-item label="被评分人">
            <el-input v-model="checkProjForm.ratee" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="评分组织">
            <el-input
              v-model="checkProjForm.attended_groups"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="lookProjectFlag = false"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="newProjDialog2"
      class="newProjDialog2"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <img src="../assets/Caution.png" alt="" />
      <div>是否确认关闭 ?</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newProjDialog2 = false">取 消</el-button>
        <el-button @click="closeNewProjDialog" style="color: #07c160"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <!-- 用户管理 -->
    <el-dialog
      :visible.sync="userDialog"
      width="640px"
      :close-on-click-modal="false"
      class="userDialog"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">评分记录</div>
      </div>
      <div class="middle">
        <div class="name">
          评分人姓名:
          {{ userIndex == -1 ? "" : userManage[userIndex].username }}
        </div>
        <div class="dept">
          部门 ：
          {{ userIndex == -1 ? "" : userManage[userIndex].department }}
        </div>
      </div>
      <el-table
        :data="userRateTable"
        height="236"
        :row-class-name="onTableRowClassName"
        :row-style="{ height: '0px' }"
        :cell-style="{ padding: '6px' }"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column prop="name" width="250px"> </el-table-column>
        <el-table-column prop="value" :formatter="(row) => row.value + '分'">
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="userLookDetail(scope.$index, scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 被评分人 , 第二个dialog用的是项目管理的样式-->
    <el-dialog
      title=""
      :visible.sync="lookRatedDialog"
      width="640px"
      :close-on-click-modal="false"
      class="userDialog"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">评分记录</div>
      </div>
      <div class="middle">
        <div class="name">
          被评分人姓名 ：{{
            ratedTableIndex == -1 ? "" : ratedMen[ratedTableIndex].name
          }}
        </div>
        <div class="dept">
          职位 ：
          {{ ratedTableIndex == -1 ? "" : ratedMen[ratedTableIndex].position }}
        </div>
      </div>
      <el-table
        :data="ratedTable"
        height="236"
        :row-class-name="onTableRowClassName"
        :row-style="{ height: '0px' }"
        :cell-style="cellStyle1"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column prop="name" width="150px"> </el-table-column>
        <!-- 占格符 -->
        <el-table-column prop="" width="250px"> </el-table-column>
        <el-table-column prop="value" :formatter="(row) => row.value + '分'">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title=""
      :visible.sync="newRatedDialog"
      width="640px"
      :close-on-click-modal="false"
      class="newProjDialog"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">添加被评分人</div>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="newRatedForm"
          label-width="80px"
          label-position="left"
        >
          <div style="display: flex; justify-content: space-between">
            <el-form-item label="姓名" style="width: 250px">
              <el-input
                v-model="newRatedForm.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" style="width: 250px">
              <el-select v-model="newRatedForm.sex" placeholder="请选择性别">
                <el-option label="男" :value="0"></el-option>
                <el-option label="女" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="电话">
            <el-input
              v-model="newRatedForm.phone_number"
              placeholder="请输入电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select
              v-model="newRatedForm.background"
              placeholder="请选择政治面貌"
              style="width: 500px"
            >
              <el-option label="普通群众" value="普通群众"></el-option>
              <el-option label="共青团员" value="共青团员"></el-option>
              <el-option label="共产党员" value="共产党员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位">
            <el-select
              v-model="newRatedForm.position"
              placeholder="请选择职位"
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in positions"
                :key="i"
                :label="item"
                :value="item"
              ></el-option>
              <!-- <el-option label="科长" value="科长"></el-option>
              <el-option label="部长" value="部长"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="单位">
            <el-select
              v-model="newRatedForm.group_id"
              placeholder="请选择单位"
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in allGroups"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="cancelNewRatedDialog"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >取 消</el-button
        >
        <el-button type="primary" @click="addNewRatee">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 评分结果 , dialog用的是项目管理的样式-->
    <el-dialog
      title=""
      :visible.sync="rateResultDetail2"
      width="640px"
      :close-on-click-modal="false"
      class="userDialog"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">评分记录</div>
      </div>
      <div class="middle">
        <div class="name">被评分人姓名: {{ rateResultDetail2Table.name }}</div>
        <div class="dept">
          平均分 ：
          <span style="color: #ff9000">{{ rateResultDetail2Table.avg }}</span
          >分
        </div>
      </div>
      <el-table
        :data="rateResultDetail2Table.arr"
        v-loadmore="loadMoreResultDetail"
        height="215"
        :row-class-name="onTableRowClassName"
        :row-style="{ height: '0px' }"
        :cell-style="{ padding: '6px' }"
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column type="index" width="120"> </el-table-column>
        <el-table-column prop="username" width="350"> </el-table-column>
        <el-table-column prop="value"> </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 预警值设置 -->
    <el-dialog
      title=""
      :visible.sync="warningDialog"
      width="640px"
      :close-on-click-modal="false"
      class="warningDialog"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">预警值设置</div>
      </div>
      <div class="content">
        <span>预警值</span>
        <input
          type="number"
          placeholder="请输入预警值"
          v-model="warningInputValue"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="warningDialog = false"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >取 消</el-button
        >
        <el-button type="primary" @click="setAlarmValue">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 后台设置 -->
    <el-dialog
      title=""
      :visible.sync="bgDialog"
      width="640px"
      :close-on-click-modal="false"
      class="newProjDialog"
      :show-close="false"
    >
      <div class="title">
        <div class="block"></div>
        <div class="text">后台管理</div>
      </div>
      <div class="form">
        <el-form
          ref="form"
          :model="bgForm"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="账号">
            <el-input
              placeholder="请输入账号"
              v-model="bgForm.email"
              :disabled="bgEditFlag"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              placeholder="请输入密码"
              v-model="bgForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-select
              v-model="bgForm.region"
              placeholder="请选择地区"
              style="width: 500px"
            >
              <el-option label="广州" value="广州"></el-option>
              <el-option label="湖南" value="湖南"></el-option>
              <el-option label="江西" value="江西"></el-option>
              <el-option label="惠州" value="惠州"></el-option>
              <el-option label="广西" value="广西"></el-option>
              <el-option label="海南" value="海南"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <el-select
              v-model="bgForm.group_id"
              @change="changeBgFormGroup"
              placeholder="请选择部门"
              style="width: 500px"
            >
              <el-option
                v-for="(item, i) in allGroups"
                :key="i"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-input
              :disabled="true"
              v-model="defaultRole"
              style="width: 500px"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="bgDialog = bgEditFlag = false"
          style="background-color: #e7e7e7; color: #5d5d5d"
          >取 消</el-button
        >
        <el-button type="primary" @click="addAdmin">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { login } from "../api/login";
import {
  getPorject,
  oper,
  getProjectById,
  createProject,
  getProjectDetail,
  getProjectDetailOfRatee,
} from "../api/project";
import * as echarts from "echarts";
import echartConfig from "../../echart_config.json";
import {
  getAllRatee,
  getOneRatee,
  getAllRateeOfProject,
  getRateeRecords,
  deleteRatee,
  createRatee,
} from "../api/ratee";
import {
  getUsers,
  deleteUser,
  getUserProfileById,
  getUserRecordDetail,
} from "../api/user";
import {
  getAllRecords,
  getRecordsOfUser,
  getRecordsAnalysis,
  getRecordsAnalysisOfRatee,
} from "../api/record";
import {
  getAllAlarm,
  setAlarm,
  getAlarm,
  getAlarmDecrease,
} from "../api/alarm";
import {
  getAllAdmin,
  createAdmin,
  delteAdmin,
  updateAdmin,
} from "../api/admin";
import { getAllGroups, getGroupById, getGroupsOfProject } from "../api/groups";
export default {
  name: "Home",
  data() {
    return {
      loginUsername: "admin@admin.is",
      loginPassword: "admin",
      access_token: "",
      tableItemCount: 93,
      barTitles: [
        "项目管理",
        "用户管理",
        "被评分人",
        "评分结果",
        "预警管理",
        "后台设置",
      ],
      positions: [
        "党委书记、董事长",
        "党委副书记、总经理",
        "党委副书记、纪委书记",
        "副总经理",
        "总会计师、财务总监",
        "总工程师",
        "总经济师",
        "工会主席"
      ],
      clickedIndex: 0,
      projManage: [],
      userManage: [],
      userManage2: {
        project_name: "",
        rate_men: "",
        department: "",
        seasonStr: "",
        avg: "",
        arr: [],
      },
      userRateTable: [],
      ratedMen: [],
      ratedTable: [],
      ratedTableIndex: -1,
      // 第一张表
      rateResultTable: [],
      // 详情(因为是自己分页，所以需要分开写，一个展示，一个存取所有)
      rateResultDetailTable: {
        seasonStr: "",
        project_name: "",
        participants: 0,
        arr: [],
      },
      rateResultDetailTableArrAll: [], // 只存数组，头部信息直接放在上面那个即可
      // 明细
      rateResultDetail2Table: {
        name: "",
        avg: "",
        arr: [],
      },
      warningManage: [],
      allWarningMode2: [], // 所有预警变更值的结果
      bgSetting: [],
      onTableRowClassName: ({ rowIndex }) => {
        if (rowIndex % 2 == 0) {
          return "statistics-grey-row";
        } else {
          return "";
        }
      },
      orangeColor: ({ columnIndex }) => {
        let i = 3;
        switch (this.rateResultDetailTable.seasonStr) {
          case "第一季度":
            i = 3;
            break;
          case "第二季度":
            i = 4;
            break;
          case "第三季度":
            i = 5;
            break;
          case "第四季度":
            i = 6;
            break;
          default:
            break;
        }
        if (columnIndex == i) {
          return "padding: 6px;color: #FF9000";
        } else {
          return "padding: 6px";
        }
      },
      redColor: ({ columnIndex }) => {
        if (columnIndex == 6) {
          return "padding: 6px;color: #EF2B00";
        } else {
          return "padding: 6px";
        }
      },
      searchInput: "",
      currentPage: 1,
      pageSize: 10,
      newProjDialog: false,
      lookProjectFlag: false,
      newProjDialog2: false,
      newProjDialog3: false,
      newProjForm: {
        year: "",
        season: "",
        name: "",
        start: "",
        end: "",
        attended_ratee_ids: [],
        attended_group_ids: [],
        group_id: "",
      },
      changeProjForm: {
        year: "",
        season: "",
        name: "",
        start: "",
        end: "",
        attended_ratee_ids: [],
        attended_group_ids: [],
        own_group_id: "",
      },
      uploadChangeProjForm: {},
      checkProjForm: {},
      newRatedForm: {
        name: "",
        sex: "",
        phone_number: "",
        background: "",
        position: "",
        group_id: "",
      },
      userDialog: false,
      userIndex: -1,
      userTable2: false,
      lookRatedDialog: false,
      newRatedDialog: false,
      rateResultDetail: false, // 查看详情
      rateResultDetail2: false, // 查看明细
      rateResultStatistics: false, // 统计
      statisticsFormTop: {
        group_id: "",
        year: "",
        season: "",
      },
      statisticsFormBottom: {
        group_id: "",
        year: "",
        votee: "",
      },
      warningDialog: false,
      warningMode: false, // false预警值，true变更值
      alarmMode2Season: 0,
      warningValue: 0,
      warningInputValue: 0,
      bgDialog: false,
      bgForm: {
        email: "",
        password: "",
        region: "",
        group_id: "",
      },
      bgEditFlag: false, // 判断是更新还是创建
      allGroups: [],
      allRatees: [],
      defaultRole: "一级管理员",
      loading: false,
      loadingProj: false,
      loadingAdmin: false,
      loadingAlarm: false,
      loadingRecords: false,
      loadingRatee: false,
      loadingUsers: false,
      userTable2Info: {
        project_id: "",
        user_id: "",
      },
      projectDetailInfo: {
        page: 1,
        id: "",
        project_id: "",
      },
      yearOptions: [],
      interval: null,
      selectedObj: {},
      power: true,
    };
  },
  watch: {
    alarmMode2Season: {
      handler: function (newVal) {
        this.getAllAlarmDecreaseFun(this.searchInput, newVal);
      },
    },
  },
  methods: {
    // 中国标准时间格式化
    dateFormatter(date) {
      let d = new Date(date);
      let year = d.getFullYear();
      let month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      return year + "-" + month + "-" + day;
    },
    changeBar(index) {
      this.clickedIndex = index;
      this.newProjDialog = false;
      this.newProjDialog2 = false;
      this.userDialog = false;
      this.rateResultDetail = false;
      this.rateResultStatistics = false;
      this.currentPage = 1;
      this.pageSize = 10;
      // !userTable2 && !rateResultDetail && !rateResultStatistics
      this.userTable2 = false;
      this.rateResultDetail = false;
      this.rateResultStatistics = false;
      this.getAllRateeFun("", true); // 防止因为搜索过（然后添加新项目时）而出现只显示部分被评分人的情况
      switch (index) {
        case 0:
          this.getProjFun();
          break;
        case 1:
          this.getUsersFun();
          break;
        case 2:
          this.getAllRateeFun();
          break;
        case 3:
          this.getAllRecordsFun();
          break;
        case 4:
          this.warningMode = false;
          this.getAllAlarmFun();
          break;
        case 5:
          this.getAdminFun();
          break;
        default:
          break;
      }
    },
    handleSizeChange(e) {
      // 更改每页条目
      console.log("sizeChange", e);
      this.pageSize = e;
      switch (this.clickedIndex) {
        case 0:
          this.getProjFun();
          break;
        case 1:
          if (!this.userTable2) this.getUsersFun();
          else
            this.getUserRecordDetailFun(
              this.userTable2Info.project_id,
              this.userTable2Info.user_id
            );
          break;
        case 2:
          this.getAllRateeFun();
          break;
        case 3:
          if (!this.rateResultDetail) this.getAllRecordsFun();
          else this.getAllRecordsDetailFun();
          break;
        case 4:
          if (!this.warningMode) this.getAllAlarmFun();
          else this.getAllAlarmDecreaseByPage();
          break;
        case 5:
          this.getAdminFun();
          break;
        default:
          break;
      }
    },
    handleCurrentChange(e) {
      // 当前页号发生变化
      console.log("currentChange", e);
      this.currentPage = e;
      switch (this.clickedIndex) {
        case 0:
          this.getProjFun();
          break;
        case 1:
          if (!this.userTable2) this.getUsersFun();
          else
            this.getUserRecordDetailFun(
              this.userTable2Info.project_id,
              this.userTable2Info.user_id
            );
          break;
        case 2:
          this.getAllRateeFun();
          break;
        case 3:
          if (!this.rateResultDetail) this.getAllRecordsFun();
          else this.getAllRecordsDetailFun();
          break;
        case 4:
          if (!this.warningMode) this.getAllAlarmFun();
          else this.getAllAlarmDecreaseByPage();
          break;
        case 5:
          this.getAdminFun();
          break;
        default:
          break;
      }
    },
    searchByKey() {
      console.log("key", this.searchInput);
      switch (this.clickedIndex) {
        case 0:
          this.getProjFun(this.searchInput);
          break;
        case 1:
          this.getUsersFun(this.searchInput);
          break;
        case 2:
          this.getAllRateeFun(this.searchInput);
          break;
        case 3:
          this.getAllRecordsFun(this.searchInput);
          break;
        case 4:
          this.getAllAlarmFun(this.searchInput);
          this.warningMode = false;
          break;
        case 5:
          this.getAdminFun(this.searchInput);
          break;
        default:
          break;
      }
    },
    cellStyle1({ column }) {
      // console.log("c", column);
      return "padding: 6px";
      // if(column.property == "name") {
      //   return "padding: 6px; text-align: left;!important"
      // } else {
      //   return "padding: 6px; text-align: right"
      // }
    },
    // 项目管理行关闭安按钮
    closeOrOpen(i, enable) {
      this.projManage[i].enable = !enable;
      let obj = { ...this.projManage[i] };
      delete obj.id;
      oper(this.access_token, this.projManage[i].id, obj).then((res) => {
        console.log(res);
      });
    },
    addNewProject() {
      let t1 = new Date(this.newProjForm.start).getTime();
      let t2 = new Date(this.newProjForm.end).getTime();
      if (t1 > t2) {
        this.$message({
          message: "开始时间不能晚于结束时间",
          type: "warning",
        });
        return;
      }
      this.newProjForm.start == this.dateFormatter(this.newProjForm.start);
      this.newProjForm.end == this.dateFormatter(this.newProjForm.end);
      if (
        this.newProjForm.year == "" ||
        (this.newProjForm.season == "" && this.newProjForm.season != 0) ||
        this.newProjForm.name == "" ||
        this.newProjForm.start == "" ||
        this.newProjForm.end == "" ||
        this.newProjForm.group_id == "" ||
        this.newProjForm.attended_ratee_ids.length == 0 ||
        this.newProjForm.attended_group_ids.length == 0
      )
        return;
      let obj = { ...this.newProjForm };
      let group_id = this.newProjForm.group_id;
      obj.start = this.dateFormatter(obj.start);
      obj.end = this.dateFormatter(obj.end);
      obj.enable = true;
      obj.alarm_threshold = 0;
      console.log(obj.group_id);
      delete obj.group_id;
      console.log("newProjForm", obj);
      createProject(this.access_token, group_id, obj).then((res) => {
        this.getProjFun();
        this.newProjForm = {
          year: "",
          season: "",
          name: "",
          start: "",
          end: "",
          attended_ratee_ids: [],
          attended_group_ids: [],
          group_id: "",
        };
        this.newProjDialog = false;
      });
    },
    updateProject() {
      this.newProjDialog3 = false;
      console.log(this.selectedObj.id);
      console.log("updateProj", this.changeProjForm);
      console.log("updateProj", this.changeProjForm.season);
      const season = {
        第一季度: 0,
        第二季度: 1,
        第三季度: 2,
        第四季度: 3,
      };
      this.changeProjForm.season = season[this.changeProjForm.season];
      this.changeProjForm.start = this.dateFormatter(this.changeProjForm.start);
      this.changeProjForm.end = this.dateFormatter(this.changeProjForm.end);
      oper(this.access_token, this.selectedObj.id, this.changeProjForm).then(
        (res) => {
          console.log(res);
          this.getProjFun();
          this.$message({
            message: "编辑成功",
          });
        }
      );
    },
    copyProject(i, row) {
      const obj = this.projManage[i];
      obj.attended_ratee_ids = [];
      obj.attended_group_ids = [];
      getAllRateeOfProject(this.access_token, 1, 100, obj.id).then((res) => {
        res.data.items.forEach((e, i) => {
          obj.attended_ratee_ids.push(e.id);
        });
      });
      // 还差评分组织
      getGroupsOfProject(this.access_token, obj.id).then((res) => {
        res.data.forEach((e, i) => {
          obj.attended_group_ids.push(e.id);
        });
      });
      let group_id = obj.own_group_id;
      delete obj.department;
      delete obj.own_group_id;
      delete obj.id;
      console.log(obj);
      createProject(this.access_token, group_id, obj).then((res) => {
        console.log("copy", res);
        this.getProjFun();
      });
    },
    lookProject(i, row) {
      this.lookProjectFlag = true;
      const obj = this.projManage[i];
      obj.ratees = "";
      Promise.all([
        getAllRateeOfProject(this.access_token, 1, 100, obj.id).then((res) => {
          console.log("ratee", res);
          if (res.data && res.data.items) {
            obj.ratees = res.data.items.map((item) => item.name).join(",");
          }
        }),
        getGroupById(this.access_token, obj.own_group_id).then((res) => {
          obj.department = res.data.name;
        }),
        getGroupsOfProject(this.access_token, obj.id).then((res) => {
          // res.data.forEach((e, i) => {
          //   if (i == res.data.length - 1) {
          //     this.checkProjForm.attended_groups = obj.attended_groups + e.name;
          //     return;
          //   }
          //   obj.attended_groups += e.name + ", ";
          // });
          obj.attended_groups = res.data.map((item) => item.name).join(",");
        }),
      ]).then((res) => {
        let seasons = ["第一季度", "第二季度", "第三季度", "第四季度"];
        console.log(obj);
        this.checkProjForm = {
          year: obj.year,
          season: seasons[obj.season],
          name: obj.name,
          department: obj.department,
          start: obj.start,
          end: obj.end,
          ratee: obj.ratees,
          attended_groups: obj.attended_groups,
          group_id: obj.department,
        };
      });
    },
    loadEditProject(i, row) {
      this.newProjDialog3 = true;
      const obj = this.projManage[i];
      this.selectedObj = obj;
      obj.ratees = "";
      getAllRateeOfProject(this.access_token, 1, 100, obj.id).then((res) => {
        res.data.items.forEach((e, i) => {
          if (i == res.data.items.length - 1) {
            this.changeProjForm.ratee = obj.ratees + e.name;
            return;
          }
          obj.ratees += e.name + ", ";
        });
      });
      getGroupById(this.access_token, obj.own_group_id).then((res) => {
        obj.department = res.data.name;
      });
      obj.attended_group_ids = [];
      obj.attended_ratee_ids = [];
      getAllRateeOfProject(this.access_token, 1, 100, obj.id).then((res) => {
        res.data.items.forEach((e, i) => {
          obj.attended_ratee_ids.push(e.id);
        });
      });
      // 还差评分组织
      getGroupsOfProject(this.access_token, obj.id).then((res) => {
        res.data.forEach((e, i) => {
          obj.attended_group_ids.push(e.id);
        });
      });
      let seasons = ["第一季度", "第二季度", "第三季度", "第四季度"];
      console.log(obj);
      this.changeProjForm = {
        year: obj.year,
        season: seasons[obj.season],
        name: obj.name,
        department: obj.department,
        start: obj.start,
        end: obj.end,
        ratee: obj.ratees,
        attended_groups: obj.attended_groups,
        own_group_id: obj.department,
        attended_ratee_ids: obj.attended_ratee_ids,
        attended_group_ids: obj.attended_group_ids,
      };
    },
    closeNewProjDialog1() {
      this.newProjDialog2 = true;
    },
    closeNewProjDialog3() {
      this.newProjDialog3 = false;
    },
    closeNewProjDialog() {
      this.newProjDialog = false;
      this.newProjDialog2 = false;
    },
    showNewProjDialog() {
      this.newProjDialog = true;
      this.newProjForm = {
        year: "",
        season: "",
        name: "",
        start: "",
        end: "",
        attended_ratee_ids: [],
        attended_group_ids: [],
        group_id: "",
      };
    },
    userLook(i, r) {
      this.userIndex = i;
      getRecordsOfUser(this.access_token, this.userManage[i].id).then((res) => {
        console.log(res);
        let arr = res.data.items;
        if (arr.length == 0) this.userRateTable = [];
        this.userDialog = true;
        let index = 0; // 异步
        arr.forEach((e, i) => {
          getProjectById(this.access_token, e.project_id).then((res) => {
            console.log(res);
            arr[i].name = res.data.name;
            if (index++ == arr.length - 1) {
              console.log("arr", arr);
              this.userRateTable = arr;
            }
          });
        });
      });
    },
    userDel(i, row) {
      console.log(row);
      deleteUser(this.access_token, row.id).then((res) => {
        console.log("userDel", res);
        this.getUsersFun();
      });
    },
    userLookDetail(i, r) {
      console.log(i, r);
      this.userDialog = false;
      this.userTable2 = true;
      this.currentPage = 1;
      this.pageSize = 10;
      this.userTable2Info.project_id = r.project_id;
      this.userTable2Info.user_id = r.user_id;
      this.getUserRecordDetailFun(r.project_id, r.user_id);
      getProjectById(this.access_token, r.project_id).then((res) => {
        console.log("projec", res);
        let season = ["第一季度", "第二季度", "第三季度", "第四季度"];
        this.userManage2.project_name = res.data.name;
        this.userManage2.seasonStr = season[res.data.season];
        this.userManage2.department =
          this.userManage[this.userIndex].department;
        this.userManage2.rate_men = this.userManage[this.userIndex].username;
      });
    },
    userReturn() {
      this.userTable2 = false;
    },
    lookRateeRecords(index, row) {
      this.lookRatedDialog = true;
      this.ratedTableIndex = index;
      getRateeRecords(this.access_token, this.ratedMen[index].id).then(
        (res) => {
          let arr = res.data.items;
          arr.forEach((e, i) => {
            getProjectById(this.access_token, e.project_id).then((res) => {
              arr[i].name = res.data.name;
              if (i == arr.length - 1) {
                this.ratedTable = arr;
                console.log(this.ratedTable);
              }
            });
          });
        }
      );
    },
    ratedDel(i, row) {
      console.log(i, row);
      console.log(this.ratedMen[i].id);
      deleteRatee(this.access_token, this.ratedMen[i].id).then((res) => {
        console.log("delRatee", res);
        this.getAllRateeFun();
      });
    },
    addNewRatee() {
      if (
        this.newRatedForm.name == "" ||
        this.newRatedForm.sex === "" ||
        this.newRatedForm.phone_number == "" ||
        this.newRatedForm.background == "" ||
        this.newRatedForm.position == "" ||
        this.newRatedForm.group_id == ""
      )
        return;
      console.log(this.newRatedForm);
      let group_id = this.newRatedForm.group_id;
      let obj = { ...this.newRatedForm };
      delete obj.group_id;
      createRatee(this.access_token, group_id, obj).then((res) => {
        console.log("添加被评分人", res);
        this.getAllRateeFun();
        this.cancelNewRatedDialog();
      });
    },
    cancelNewRatedDialog() {
      this.newRatedDialog = false;
      this.newRatedForm = {
        name: "",
        sex: "",
        phone_number: "",
        background: "",
        position: "",
        group_id: "",
      };
    },
    showRateResultDetail(i, row) {
      console.log("i, row", i, row);
      this.projectDetailInfo.project_id = row.id;
      this.rateResultDetail = true;
      this.currentPage = 1;
      this.pageSize = 10;
      // 这里暂时这么处理
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      getProjectDetail(this.access_token, row.id).then((res) => {
        console.log("getProjectDetail", res);
        let season = ["第一季度", "第二季度", "第三季度", "第四季度"];
        this.rateResultDetailTable.seasonStr = season[row.season];
        this.rateResultDetailTable.project_name =
          row.year + "年" + season[row.season] + row.name;
        // row.year + "年" + season[row.season] + "廉洁指数评分";
        this.rateResultDetailTable.participants = row.participants;
        let arr = new Array();
        // Promise.all([

        // ])
        let PromiseArr = [];
        for (let i = 0; i < 4; i++) {
          PromiseArr.concat(
            res.data[i].map((item, index) => {
              return new Promise((resolve, reject) => {
                if (arr[item.ratee_id] == undefined) {
                  arr[item.ratee_id] = {
                    id: item.ratee_id,
                    name: item.ratee_name,
                    department: "",
                  };
                }
                if (item.season == row.season) {
                  // arr[item.ratee_id].status =
                  //   item.avg_rating <= this.warningValue; // true预警
                  arr[item.ratee_id].status = "";
                }
                if (i == 0) arr[item.ratee_id].s0 = item.avg_rating;
                else if (i == 1) arr[item.ratee_id].s1 = item.avg_rating;
                else if (i == 2) arr[item.ratee_id].s2 = item.avg_rating;
                else arr[item.ratee_id].s3 = item.avg_rating;
                // 获取部门名称
                getOneRatee(this.access_token, item.ratee_id)
                  .then((res) => {
                    getGroupById(this.access_token, res.data.own_group_id).then(
                      (res) => {
                        arr[item.ratee_id].department = res.data.name;
                        resolve();
                      }
                    );
                  })
                  .catch((res) => {
                    console.log("无权", res);
                  });
              });
            })
          );
        }
        Promise.all(PromiseArr).then((res) => {
          this.loading = false;
        });

        // this.rateResultDetailTable.arr = Object.values(arr);
        this.rateResultDetailTableArrAll = Object.values(arr);
        this.tableItemCount = this.rateResultDetailTableArrAll.length;
        this.rateResultDetailTable.arr = this.rateResultDetailTableArrAll.slice(
          0,
          this.pageSize
        );
        console.log(
          "this.rateResultDetailTable.arr",
          this.rateResultDetailTable.arr
        );
        if (row.season === 0) return;
        this.rateResultDetailTable.arr.forEach((item, i) => {
          if (item["s" + row.season] == undefined)
            this.rateResultDetailTable.arr[i].status = "";
          else if (item["s" + (row.season - 1)] == undefined)
            this.rateResultDetailTable.arr[i].status = "正常";
          else if (item["s" + row.season] - item["s" + (row.season - 1)] < -5)
            this.rateResultDetailTable.arr[i].status = "预警";
          else this.rateResultDetailTable.arr[i].status = "正常";
        });
        console.log(this.rateResultDetailTable.arr);
      });
    },
    showRateResultDetail2(i, row) {
      console.log("check", i, row);
      this.rateResultDetail2 = true;
      this.rateResultDetail2Table.name = row.name;
      this.rateResultDetail2Table.avg = 0;
      this.rateResultDetail2Table.arr = [];
      this.projectDetailInfo.id = row.id;
      this.projectDetailInfo.page = 1;
      this.getProjectDetailOfRateeFun();
    },
    //Echart
    analysisTop() {
      const { group_id, year, season } = this.statisticsFormTop;
      getRecordsAnalysis(this.access_token, group_id, year, season)
        .then((res) => {
          console.log("getRecordsAnalysis", res);
          if (res.data) {
            let { distributed, ratee } = res.data;
            let columnY = [];
            let columnVal = [];
            for (let i = 0; i < ratee.length; i++) {
              columnY.push(ratee[i].ratee_name);
              columnVal.push(ratee[i].avg_rating);
            }
            this.columnDiagram = echarts.init(
              document.getElementById("columnDiagram"),
              "myConfig"
            );
            var columnOption = {
              xAxis: {},
              yAxis: {
                type: "category",
                data: columnY,
                inverse: true,
              },
              series: [
                {
                  name: "平均分",
                  type: "bar",
                  data: columnVal,
                },
              ],
            };
            this.columnDiagram.setOption(columnOption);
            this.pieDiagram = echarts.init(
              document.getElementById("pieDiagram"),
              "myConfig"
            );
            let pieData = [];
            for (let item in distributed) {
              pieData.push({ name: item, value: distributed[item] });
            }
            console.log(pieData);
            var pieOption = {
              series: [
                {
                  type: "pie",
                  data: pieData,
                },
              ],
            };
            this.pieDiagram.setOption(pieOption);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查查询参数是否正确，网络连接是否正常",
            type: "warning",
          });
        });
    },
    analysisBottom() {
      const { group_id, year, votee } = this.statisticsFormBottom;
      getRecordsAnalysisOfRatee(this.access_token, group_id, year, votee)
        .then((res) => {
          if (res.data) {
            this.lineDiagram = echarts.init(
              document.getElementById("lineDiagram"),
              "myConfig"
            );
            console.log(res);

            let proj = {};
            for (let i in res.data) {
              let item = res.data[i];
              if (!proj[item.project_name]) {
                proj[item.project_name] = [
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                ];
              }
              proj[item.project_name][item.season] = item.avg_rating;
            }
            let series = [];
            let legends = [];
            for (let item in proj) {
              series.push({
                data: proj[item],
                type: "line",
                stack: "x",
                name: item,
              });
              legends.push(item);
            }
            var lineOption = {
              legend: {
                data: legends,
                icon: "rect",
              },
              xAxis: {
                type: "category",
                data: ["第一季度", "第二季度", "第三季度", "第四季度"],
              },
              yAxis: {
                type: "value",
              },
              series,
            };
            this.lineDiagram.setOption(lineOption);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message({
            message: "请检查查询参数是否正确，网络连接是否正常",
            type: "warning",
          });
        });
    },
    resetFormTop() {
      this.statisticsFormTop = {
        group_id: "",
        year: "",
        season: "",
      };
      if (this.pieDiagram) {
        this.pieDiagram.clear();
      }
      if (this.columnDiagram) {
        this.columnDiagram.clear();
      }
    },
    resetFormBottom() {
      this.statisticsFormBottom = {
        year: "",
        votee: "",
      };
      if (this.lineDiagram) {
        this.lineDiagram.clear();
      }
    },
    changeWarningMode() {
      this.warningMode = !this.warningMode;
      if (this.warningMode === true)
        this.getAllAlarmDecreaseFun(this.searchInput);
      else this.getAllAlarmFun(this.searchInput);
    },
    showWarningDialog() {
      this.warningDialog = true;
      this.warningInputValue = this.warningValue;
    },
    setAlarmValue() {
      if (this.warningInputValue == "" || this.warningInputValue == undefined)
        return;
      console.log(this.warningInputValue);
      setAlarm(this.access_token, this.warningInputValue).then((res) => {
        this.warningDialog = false;
        this.warningValue = this.warningInputValue;
        this.getAllAlarmFun();
      });
    },
    getAlarmValue() {
      getAlarm(this.access_token).then((res) => {
        this.warningValue = res.data.value;
      });
    },
    showBgDialog() {
      if (!this.power) return;
      this.bgDialog = true;
      this.bgForm = {
        email: "",
        password: "",
        region: "",
        group_id: "",
      };
    },
    addAdmin() {
      if (
        this.bgForm.group_id == "" ||
        this.bgForm.email == "" ||
        this.bgForm.password == "" ||
        this.bgForm.region == ""
      )
        return;
      let obj = { ...this.bgForm };
      delete obj.group_id;
      if (obj.email.slice(-9) != "@admin.is") obj.email += "@admin.is";
      if (this.bgEditFlag) {
        console.log(obj);
        console.log(this.bgForm);
        updateAdmin(this.access_token, this.bgForm.user_id, obj).then((res) => {
          console.log("updateAdmin", res);
          this.bgDialog = false;
          this.getAdminFun();
        });
      } else {
        createAdmin(this.access_token, this.bgForm.group_id, obj).then(
          (res) => {
            console.log("addAdmin", res);
            this.bgDialog = false;
            this.getAdminFun();
          }
        );
      }
    },
    bgEdit(i, r) {
      console.log(i, r);
      this.bgEditFlag = true;
      this.bgDialog = true;
      this.defaultRole = r.role;
      this.bgForm = {
        region: r.region,
        email: r.email.slice(0, -9),
        password: "",
        group_id: r.group_id,
        user_id: r.id,
      };
      console.log("bgForm", this.bgForm);
    },
    bgDel(i, r) {
      console.log(r);
      delteAdmin(this.access_token, r.id).then((res) => {
        console.log(res);
        this.getAdminFun();
      });
    },
    changeBgFormGroup(value) {
      getGroupById(this.access_token, value).then((res) => {
        if (res.data.name == "总公司") this.defaultRole = "一级管理员";
        else this.defaultRole = "二级管理员";
      });
    },
    getProjFun(key = "") {
      this.loadingProj = true;
      getPorject(this.access_token, this.currentPage, this.pageSize, key).then(
        (res) => {
          console.log("res", res);
          let arr = res.data.items;
          if (arr.length == 0) {
            this.projManage = [];
            this.loadingProj = false;
          }
          this.tableItemCount = res.data.total;
          let index = 0; // 异步
          arr.forEach((item, i) => {
            getGroupById(this.access_token, item.own_group_id).then((res) => {
              arr[i].department = res.data.name;
              if (index++ == arr.length - 1) {
                this.projManage = arr;
                this.loadingProj = false;
              }
            });
          });
        }
      );
    },
    getAdminFun(key = "") {
      this.loadingAdmin = true;
      getAllAdmin(this.access_token, this.currentPage, this.pageSize, key)
        .then((res) => {
          console.log("allAdmin", res);
          this.tableItemCount = res.data.total;
          let arr = res.data.items;
          if (arr.length == 0) {
            this.bgSetting = [];
            this.loadingAdmin = false;
          }
          let index = 0; // 异步
          for (let i = 0; i < arr.length; i++) {
            getGroupById(this.access_token, arr[i].group_id).then((res) => {
              arr[i].department = res.data.name;
              arr[i].email = arr[i].email.slice(0, -9);
              let str = "";
              if (index++ == arr.length - 1) {
                this.bgSetting = arr;
                this.loadingAdmin = false;
              }
            });
          }
        })
        .catch((res) => {
          console.log("没有权限", res);
          this.bgSetting = [];
          this.loadingAdmin = false;
          this.tableItemCount = 0;
          this.$message({
            message: "无权限查看",
            type: "warning",
          });
          this.power = false;
        });
    },
    getAllRateeFun(key = "", isFirst = false) {
      this.loadingRatee = true;
      getAllRatee(this.access_token, this.currentPage, this.pageSize, key).then(
        (res) => {
          console.log("allRatee", res);
          if (!isFirst) {
            console.log(isFirst);
            this.tableItemCount = res.data.total;
          }
          this.ratedMen = res.data.items;
          this.loadingRatee = false;
        }
      );
    },
    getUsersFun(key = "") {
      this.loadingUsers = true;
      getUsers(this.access_token, this.currentPage, this.pageSize, key).then(
        (res) => {
          console.log("allUsers", res);
          this.tableItemCount = res.data.total;
          let arr = res.data.items;
          if (arr.length == 0) {
            this.userManage = [];
            this.loadingUsers = false;
          }
          let index = 0; // 异步
          arr.forEach((item, i) => {
            getGroupById(this.access_token, item.group_id).then((res) => {
              arr[i].department = res.data.name;
              if (index++ == arr.length - 1) {
                this.userManage = arr;
                this.loadingUsers = false;
              }
            });
          });
        }
      );
    },
    getAllRecordsFun(key = "") {
      this.loadingRecords = true;
      getAllRecords(
        this.access_token,
        this.currentPage,
        this.pageSize,
        key
      ).then((res) => {
        console.log("allRecords", res);
        this.tableItemCount = res.data.total;
        let newarr = res.data.items;
        if (newarr.length == 0) {
          this.loadingRecords = false;
          this.rateResultTable = [];
        }
        let index = 0; // 异步
        for (let i = 0; i < newarr.length; i++) {
          getProjectById(this.access_token, newarr[i].id)
            .then((res) => {
              newarr[i].enable = res.data.enable;
            })
            .then(() => {
              let tempGroups = this.allGroups;
              newarr.forEach((item) => {
                tempGroups.forEach((group) => {
                  if (item.id === group.id) {
                    item.department = group.name;
                  }
                });
              });
              getGroupById(this.access_token, newarr[i].own_group_id).then(
                (res) => {
                  newarr[i].department = res.data.name;
                  if (index++ == newarr.length - 1) {
                    this.rateResultTable = newarr;
                    this.loadingRecords = false;
                  }
                }
              );
            });
        }
      });
    },
    getAllAlarmFun(key = "") {
      this.loadingAlarm = true;
      this.getAlarmValue();
      getAllAlarm(this.access_token, this.currentPage, this.pageSize, key).then(
        (res) => {
          console.log("allAlarm", res);
          this.tableItemCount = res.data.total;
          let arr = res.data.items;
          if (arr.length == 0) {
            this.warningManage = [];
            this.loadingAlarm = false;
          }
          let index = 0; // 异步
          for (let i = 0; i < arr.length; i++) {
            getOneRatee(this.access_token, arr[i].ratee_id)
              .then((res) => {
                arr[i].sex = res.data.sex;
                arr[i].background = res.data.background;
                arr[i].position = res.data.position;
                arr[i].phone_number = res.data.phone_number;
                if (index++ == arr.length - 1) {
                  this.warningManage = arr;
                  this.loadingAlarm = false;
                }
              })
              .catch((res) => {
                // arr;
                if (index++ == arr.length - 1) {
                  this.warningManage = arr;
                  this.loadingAlarm = false;
                }
              });
          }
        }
      );
    },
    getAllAlarmDecreaseFun(key = "", curSeason = 3) {
      this.loadingAlarm = true;
      getAlarmDecrease(this.access_token, key, curSeason).then((res) => {
        console.log("变更值结果", res);
        this.allWarningMode2 = res.data;
        this.currentPage = 1;
        if (res.data.length > this.pageSize) this.warningManage = res.data;
        else this.warningManage = res.data.slice(0, this.pageSize);
        this.tableItemCount = res.data.length;
        let arr = this.warningManage;
        let index = 0; // 异步
        if (arr.length === 0) this.loadingAlarm = false;
        for (let i = 0; i < arr.length; i++) {
          getOneRatee(this.access_token, arr[i].ratee_id)
            .then((res) => {
              arr[i].sex = res.data.sex;
              arr[i].background = res.data.background;
              arr[i].position = res.data.position;
              arr[i].phone_number = res.data.phone_number;
              if (index++ == arr.length - 1) {
                this.warningManage = arr;
                this.loadingAlarm = false;
              }
            })
            .catch((res) => {
              if (index++ == arr.length - 1) {
                this.warningManage = arr;
                this.loadingAlarm = false;
              }
            });
        }
      });
    },
    getAllAlarmDecreaseByPage() {
      let arr = [];
      let startIndex = (this.currentPage - 1) * this.pageSize;
      if (startIndex + this.pageSize > this.allWarningMode2.length)
        arr = this.allWarningMode2.slice(startIndex);
      else
        arr = this.allWarningMode2.slice(
          startIndex,
          startIndex + this.pageSize
        );
      let index = 0; // 异步
      for (let i = 0; i < arr.length; i++) {
        getOneRatee(this.access_token, arr[i].ratee_id)
          .then((res) => {
            arr[i].sex = res.data.sex;
            arr[i].background = res.data.background;
            arr[i].position = res.data.position;
            arr[i].phone_number = res.data.phone_number;
            if (index++ == arr.length - 1) {
              this.warningManage = arr;
              this.loadingAlarm = false;
            }
          })
          .catch((res) => {
            if (index++ == arr.length - 1) {
              this.warningManage = arr;
              this.loadingAlarm = false;
            }
          });
      }
    },
    getAllGroupsFun() {
      getAllGroups(this.access_token).then((res) => {
        console.log("allGroups", res);
        this.allGroups = res.data;
      });
    },
    getAllRateesOfProjectFun() {
      getAllRatee(this.access_token, 1, 100, "")
        .then((res) => {
          console.log(res.data);
          this.allRatees = res.data.items;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserRecordDetailFun(project_id, user_id) {
      getUserRecordDetail(
        this.access_token,
        this.currentPage,
        this.pageSize,
        project_id,
        user_id
      ).then((res) => {
        console.log("userDetail", res);
        this.tableItemCount = res.data.total;
        if (res.data.items.length == 0) this.userManage2.arr = [];
        else {
          this.userManage2.avg = res.data.items[0].avg_rating.toFixed(2);
          this.userManage2.arr = res.data.items;
        }
      });
    },
    getAllRecordsDetailFun() {
      let pos1 = (this.currentPage - 1) * this.pageSize;
      let pos2 = this.currentPage * this.pageSize;
      this.rateResultDetailTable.arr = this.rateResultDetailTableArrAll.slice(
        pos1,
        pos2
      );
    },
    getProjectDetailOfRateeFun() {
      getProjectDetailOfRatee(
        this.access_token,
        this.projectDetailInfo.id,
        this.projectDetailInfo.project_id,
        this.projectDetailInfo.page,
        10
      ).then((res) => {
        console.log(res);
        let arr = [...res.data.items];
        let avg = this.rateResultDetail2Table.avg;
        // if (arr.length == 0) this.rateResultDetail2Table.arr = [];
        if (arr.length == 0) this.projectDetailInfo.page -= 1; // 说明没有数据了，与后面的+1抵消
        let index = 0;
        res.data.items.forEach((item, i) => {
          avg += item.value;
          getUserProfileById(this.access_token, item.user_id).then((res) => {
            console.log("user", res);
            arr[i].username = res.data.username;
            arr[i].value = arr[i].value.toFixed(2);
            if (index++ == arr.length - 1) {
              // this.rateResultDetail2Table.arr = arr;
              this.rateResultDetail2Table.arr.push(...arr);
              this.rateResultDetail2Table.avg = (avg / arr.length).toFixed(2);
            }
          });
        });
      });
      this.projectDetailInfo.page += 1;
    },
    loadMoreResultDetail() {
      console.log("loadMoreResultDetail");
      this.getProjectDetailOfRateeFun();
    },
    loginInfo(info) {
      console.log("登录信息", info);
      const { access_token, loginUsername, loginPassword } = info;
      this.access_token = access_token;
      this.loginUsername = loginUsername;
      this.loginPassword = loginPassword;
      localStorage.setItem("loginUsername", loginUsername);
      localStorage.setItem("loginPassword", loginPassword);
      sessionStorage.setItem("access_token", access_token); // token会过期，存session
      this.getProjFun();
      this.getAllGroupsFun();
      this.getAllRateesOfProjectFun();
      this.getAllRateeFun("", true); // 防止总页数覆盖
      this.getAlarmValue();
      echarts.registerTheme("myConfig", echartConfig);
    },
    rateResultReturn() {
      this.rateResultDetail = false;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getAllRecordsFun();
    },
  },
  mounted() {
    // 账号密码不知道有没有用，没用可以删了
    let token = sessionStorage.getItem("access_token");
    console.log("token", token);
    let username = localStorage.getItem("loginUsername");
    let password = localStorage.getItem("loginPassword");
    if (username != null) this.loginUsername = username;
    if (password != null) this.loginPassword = password;
    if (token != null) {
      this.access_token = token;
      this.getProjFun();
      this.getAllGroupsFun();
      this.getAllRateesOfProjectFun();
      this.getAllRateeFun("", true); // 防止总页数覆盖
      this.getAlarmValue();
      echarts.registerTheme("myConfig", echartConfig);
    }
    // setTimeout(() => {
    //   this.access_token = "";
    //   sessionStorage.setItem("access_token", "");
    // }, 5000);
    this.interval = setInterval(() => {
      login(this.loginUsername + "@admin.is", this.loginPassword)
        .then((res) => {
          console.log("login", res);
          this.access_token = res.data.access_token;
          sessionStorage.setItem("access_token", this.access_token);
        })
        .catch(function () {
          alert("登录失败, 用户名或密码错误, 请重新登录");
          this.$router.push({
            path: `/login`,
          });
        });
    }, 100000);
    let d = new Date();
    let thisYear = d.getFullYear();
    this.yearOptions.push(thisYear);
    this.yearOptions.push(thisYear + 1);
    this.$bus.$on("loginInfo", this.loginInfo);
    // console.log("home-router", this.$route.params);
    // const { access_token, loginUsername, loginPassword } = this.$route.params;
    // this.access_token = access_token;
    // this.loginUsername = loginUsername;
    // this.loginPassword = loginPassword;
    // this.getProjFun();
    // this.getAllGroupsFun();
    // this.getAllRateeFun();
    // this.getAlarmValue();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        console.log("el", el);
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function () {
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= 0.5) {
            binding.value(); //执行在使用时绑定的函数，在这里即loadMorePerson方法
          }
        });
      },
    },
  },
};
</script>

<style lang="scss">
#app {
  background-color: #f5f5f5;
}

.top {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 8vh;
  background-color: #fff;
  margin-bottom: 2vh;
  // padding-top: 1.5vh;
  padding-left: 10px;

  .logo {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: auto;
    background-color: pink;
    // margin-top: 5px;
  }

  .user {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    width: 130px;
    height: 5vh;
    // margin-top: 1.5vh;
    right: 20px;

    img {
      width: 35px;
      height: 35px;
      font-weight: bold;
      background-color: #d9d9d9;
      border-radius: 50%;
      overflow: hidden;
    }

    .name {
      line-height: 5vh;
    }
  }
}

.leftBar {
  box-sizing: border-box;
  min-height: 90vh;
  background-color: #003419;
  padding-top: 20px;

  .leftBtn {
    width: 100%;
    height: 50px;
    color: #fff;
    border: none;
    border-radius: 0px;
    background-color: rgba(0, 0, 0, 0);
    margin-left: 0px;
  }

  .leftBtn:hover {
    background-color: rgba(7, 193, 96, 0.35);
  }
}

.el-table th.el-table__cell > .cell {
  text-align: center;
  color: #000;
}

.el-table__cell > .cell {
  text-align: center;
}

// 斑马纹
.el-table__row.statistics-grey-row {
  background: #f5f5f5;
}

// 去掉下边框
.el-table::before {
  width: 0;
}

.main {
  position: relative;
  box-sizing: border-box;
  height: 90vh;
  padding: 30px;
  background-color: #fff;
  overflow: auto;

  .mainTop {
    display: flex;
    width: 100%;
    margin-bottom: 20px;

    .el-input {
      width: 40%;
      height: 40px;
    }

    .two {
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      width: 60%;
      margin-left: 15px;

      .image {
        box-sizing: border-box;
        cursor: pointer;
        width: 35px;
        height: 35px;
        background-color: #07c160;
        border-radius: 3px;
        padding-top: 6px;
        padding-left: 6px;
        margin-top: 3px;

        img {
          width: 22px;
          height: 22px;
        }
      }
      .el-button {
        position: absolute;
        right: 10px;
      }
      .newProj {
        height: 40px;
        color: #fff;
        background-color: #ffa800;
      }
    }
  }

  .el-table {
    .el-button {
      color: #07c160;
      font-weight: bold;
      font-size: 13px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
    }
  }

  .pagination {
    position: absolute;
    width: 95%;
    bottom: 25px;

    .userReturn {
      display: inline-block;
      background-color: #ffa800;
      color: #fff;
    }

    // 位置
    .el-pagination {
      display: inline-block;

      .el-pagination__total {
        display: inline-block;
        width: 120px;
        text-align: center;
      }

      .el-pagination__sizes {
        margin-left: 10px;
        // margin-right: 150px;
        margin-right: calc(90%);

        .el-icon-arrow-up {
          color: #07c160;
        }
      }

      .el-pagination__jump {
        // 页数变化会浮动，用绝对定位
        position: absolute;
        right: 20px;
      }
    }

    // 颜色
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #07c160;
      color: #fff;
    }

    .el-pagination.is-background .el-pager li.active {
      color: #fff;
      cursor: default;
    }

    .el-pagination.is-background .el-pager li:hover {
      color: #07c160;
    }

    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #07c160;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active:hover {
      background-color: #07c160;
      color: #fff;
    }
  }

  .userTable2 {
    .head {
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      padding-left: 35px;
      padding-right: 80px;
      background-color: #f5f5f5;
      margin-bottom: 20px;
    }
  }

  .resultTable2 {
    .head {
      display: flex;
      justify-content: space-between;
      height: 40px;
      line-height: 40px;
      padding-left: 100px;
      padding-right: 80px;
      background-color: #f5f5f5;
      margin-bottom: 20px;
    }
  }

  .statistic {
    padding-left: 40px;

    .head {
      display: flex;
      justify-content: space-between;

      .selects {
        display: flex;
        justify-content: space-around;

        .el-select {
          width: 300px;
          margin-right: 20px;

          .el-icon-arrow-up {
            color: #07c160;
          }
        }
      }

      .el-button {
        width: 140px;
        color: #fff;
        background-color: #07c160;
      }

      .reset {
        background-color: #cfcfcf;
        margin-right: 17px;
        margin-left: auto;
      }
    }

    .middle {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      margin-bottom: 25px;

      .title {
        display: flex;
        height: 20px;
        font-weight: bold;
        margin-bottom: 15px;

        .block {
          width: 7px;
          height: 20px;
          background-color: #07c160;
          margin-right: 5px;
        }
      }

      .box {
        width: 600px;
        height: 300px;
        box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
        margin-right: 20px;
      }
    }

    .bottom {
      margin-bottom: 20px;

      .optionBox {
        display: flex;
        margin-bottom: 30px;

        .selects {
          display: flex;
          justify-content: space-around;

          .el-select {
            width: 300px;
            margin-right: 20px;

            .el-icon-arrow-up {
              color: #07c160;
            }
          }
        }

        .el-button {
          width: 140px;
          color: #fff;
          background-color: #07c160;
          margin-right: 0px;
        }

        .reset {
          background-color: #cfcfcf;
          margin-right: 17px;
          margin-left: auto;
        }
      }

      .title {
        display: flex;
        height: 20px;
        font-weight: bold;
        margin-bottom: 10px;

        .block {
          width: 7px;
          height: 20px;
          background-color: #07c160;
          margin-right: 5px;
        }
      }

      .box {
        width: 99%;
        height: 300px;
        box-shadow: 4px 4px 40px 0 rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.newProjDialog {
  overflow: hidden;

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 20px 30px;
    overflow: hidden;
  }

  .title {
    display: flex;
    height: 20px;
    font-weight: bold;
    margin-bottom: 20px;

    .block {
      width: 7px;
      height: 20px;
      background-color: #07c160;
      margin-right: 5px;
    }
  }

  .form {
    .el-form-item {
      margin-bottom: 10px;
    }

    .el-input {
      height: 35px;

      .el-input__inner {
        box-sizing: border-box;
        height: 35px;
        background-color: #f8f8f8;
        border: none;
        padding-left: 20px;
      }

      .el-icon-arrow-up {
        height: 120%;
        color: #07c160;
      }
    }

    .datePicker {
      position: relative;

      .el-input__inner {
        padding-left: 20px;
      }

      .el-input__prefix {
        display: none;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 10px;

    .el-button {
      width: 200px;
      background-color: #07c160;
    }
  }
}

.newProjDialog2 {
  margin-top: 100px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;

  img {
    display: inline-block;
    width: 70px;
    height: 70px;
  }

  .dialog-footer {
    position: relative;
    display: flex;
    justify-content: space-around;
    width: 100%;

    .el-button {
      border: none;
      color: #a3a3a3;
    }
  }

  .dialog-footer::before {
    content: "|";
    position: absolute;
    font-size: 12px;
    left: 180px;
    bottom: 10px;
    color: #e8e8e8;
  }

  .dialog-footer::after {
    content: "|";
    position: absolute;
    font-size: 12px;
    left: 180px;
    bottom: 22px;
    color: #e8e8e8;
  }
}

.userDialog {
  overflow: hidden;

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 30px;
    overflow: hidden;
  }

  .title {
    display: flex;
    height: 20px;
    font-weight: bold;
    margin-bottom: 10px;

    .block {
      width: 7px;
      height: 20px;
      background-color: #07c160;
      margin-right: 5px;
    }
  }

  .middle {
    display: flex;
    justify-content: space-between;
    width: 580px;
    margin: 25px auto 15px;
  }

  .el-table {
    margin-bottom: 10px;

    .el-button {
      color: #07c160;
      font-weight: bold;
      font-size: 13px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
    }
  }
}

.warningDialog {
  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 25px 30px;
    overflow: hidden;
  }

  .title {
    display: flex;
    height: 20px;
    font-weight: bold;
    margin-bottom: 10px;

    .block {
      width: 7px;
      height: 20px;
      background-color: #07c160;
      margin-right: 5px;
    }
  }

  .content {
    margin-top: 100px;
    margin-bottom: 80px;

    span {
      margin-right: 35px;
    }

    input {
      width: 470px;
      height: 35px;
      line-height: 35px;
      background-color: #f8f8f8;
      border: none;
      outline: none;
      border-radius: 5px;
      padding-left: 15px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 10px;

    .el-button {
      width: 200px;
      background-color: #07c160;
    }
  }
}
</style>
