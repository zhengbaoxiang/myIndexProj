<template>
  <div class="mine-issue">
    <my-header title="常见问题"></my-header>
    <div class="p15">
      <p>天溯运维护工服务常见问题</p>
      <p class="mt5">
        <span class="text-green font12">天溯运维</span>
        <span class="text-grey font12 pl10">2019-03-01</span>
      </p>
      <div class="smallTitle">常见问题</div>
      <div class="detail-info">
        <h3>1.一号护工平台的护理员专业吗？</h3>
        <p>1) 规范的平台标准：护理员都是实名认证、持证上岗的；
          <br>2) 三甲级医院的资深医护专家培训团队：经过48课时实践培训、36课时理论培训、48课时社区服务，覆盖18个科室21种病种和护理员晋升培训；
          <br>3) 护理员规范的服务标准：分病种分项目标准化操作、严格遵守标准的服务流程、专业的日本介护服务、上户自带专用餐具水杯、专用梳洗用具、与用户分餐、提供合理膳食食谱。
        </p>
        <h3>2.外省的可以提供服务吗？</h3>
        <p>目前我们产品服务地区只开通了北京、上海，其他地区正在规划中，敬请期待。</p>

        <h3>3.如何退款？，退款如何计算</h3>
        <p>目前我们产品服务地区只开通了北京、上海，其他地区正在规划中，敬请期待。</p>
      </div>
      <div class="center p15 m15">
        <a class="text-green" href="tel:114">联系客服</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mine_issue'
}
</script>
<style lang="less" scoped>
.mine-issue {
  background-color: @color-white;
  .smallTitle {
    height: 112px;
    line-height: 112px;
    margin: 15px 0;
    background-image: url("../../assets/imgs/problem.png");
    background-size: 100% 100%;
    color: #3e4255;
    font-size: 26px;
    text-align: center;
  }
  .detail-info {
    h3 {
      padding-top: @m15;
    }
    p {
      font-size: @font-size-small;
      color: @color-grey;
      line-height: 24px;
    }
  }
}
</style>
