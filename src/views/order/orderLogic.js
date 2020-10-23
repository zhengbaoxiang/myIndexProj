// 订单按钮判断条件

// `service_status` int(11) NOT NULL COMMENT
// '服务状态，1-待开始，2-进行中，3-提前结束，4-正常结束',
// `pay_status` int(11) NOT NULL COMMENT
// '支付状态，0-已取消，1-待支付，2-已支付，3-待退款，4-退款中，5-已退款，6-退款失败   7-延期支付',

import MyUtils from '@/utils/myUtils'

const buttonLogic = {
  // 取消订单，用户自己的订单可以自己取消；工作台的订单可以工作台取消
  cancelOrder: (orderInfo) => {
    const hasOwner =
      (isUser() && orderInfo.source === 1) ||
      (isWorker() && orderInfo.source !== 1)
    return (
      hasOwner &&
      isUserOrManager() &&
      (orderInfo.payStatus === 1 ||
        (orderInfo.payStatus === 7 && orderInfo.serviceStatus === 1))
    )
  },
  // 退款申请，已支付状态的订单，工作人员+用户可发起 （ 若未结单的全包价已付款需要申请退款，则会提示先联系主管结单)
  refundApply: (orderInfo) => {
    return (
      isUserOrManager() &&
      (orderInfo.serviceStatus === 1 || orderInfo.serviceStatus === 2) &&
      orderInfo.payStatus === 2
    )
  },
  // 发起售后（订单已结束），工作人员+用户可发起
  refundEndApply: (orderInfo) => {
    return (
      isUserOrManager() &&
      orderInfo.serviceStatus === 4 &&
      orderInfo.payStatus === 2 &&
      new Date().getTime() - orderInfo.realEndTime < 7 * 24 * 60 * 60 * 1000
    )
  },
  // 建议与反馈
  suggest: (orderInfo) => {
    return isUser() && orderInfo.serviceStatus >= 2 && orderInfo.payStatus >= 2
  },
  // 用户，微信付款
  pay: (orderInfo) => {
    return (
      isUser() &&
      (orderInfo.payStatus === 1 || orderInfo.payStatus === 7) &&
      !(orderInfo.priceKind === 1 && orderInfo.endTime === null)
    )
  },
  // 微信缴存 - 未缴存的现金订单 ： 已支付(非0）状态，或者已退款（非0）状态。
  appPay: (orderInfo) => {
    return (
      getRole() === '4' &&
      orderInfo.payWay === 1 &&
      orderInfo.depositStatus === 0 &&
      (
        (orderInfo.payStatus === 2 && orderInfo.sumPrice > 0) ||
        (orderInfo.payStatus === 5 &&
          orderInfo.sumPrice - orderInfo.careOrderRefund.realRefundSumPrice >
          0))
    )
  },
  // 结束订单，工作台可以发起没有结束日期的 && 服务进行中的 订单。
  endOrder: (orderInfo) => {
    return isWorker() && orderInfo.serviceStatus === 2 && !orderInfo.endTime
  },
  // 续单 - 进行中或已结束的订单，排除取消/退款。
  copyOrder: (orderInfo) => {
    return (
      isWorker() &&
      (orderInfo.serviceStatus === 2 || orderInfo.serviceStatus === 4) &&
      (orderInfo.payStatus === 1 ||
        orderInfo.payStatus === 2 ||
        orderInfo.payStatus === 7)
    )
  },
  // 主管的申请改价
  applayNewPrice: (orderInfo) => {
    return (
      getRole() === '4' &&
      ((orderInfo.payStatus === 1 && orderInfo.serviceStatus === 1) ||
        orderInfo.payStatus === 7) &&
      orderInfo.priceChangeStatus === 1 &&
      !(orderInfo.priceKind === 1 && orderInfo.endTime === null)
    )
  },
  // 主管可以申请延迟付款
  delayPay: (orderInfo) => {
    return (
      getRole() === '4' && orderInfo.payStatus === 1
    )
  },
  // 主管可以确认收款
  cashOrderConfirm: (orderInfo) => {
    return (
      getRole() === '4' &&
      (orderInfo.payStatus === 1 || orderInfo.payStatus === 7) &&
      orderInfo.payWay === 1 &&
      !(orderInfo.priceKind === 1 && !orderInfo.endTime)
    )
  },
  // 退款审批
  refundApprove: (orderInfo) => {
    return (
      orderInfo.payStatus === 3 &&
      ((orderInfo.careOrderRefund.applyUserRole !== 4 && getRole() === '4') ||
        isManager())
    )
  },
  // 改价审批
  priceChangeApprove: (orderInfo) => {
    return (
      (isManager()) &&
      orderInfo.priceChangeHandleStatus === 1
    )
  },
  // 展示更多按钮
  moreButton: (orderInfo) => {
    let buttonSize = 0
    if (buttonLogic.applayNewPrice(orderInfo)) buttonSize++
    if (buttonLogic.cancelOrder(orderInfo)) buttonSize++
    if (buttonLogic.delayPay(orderInfo)) buttonSize++
    if (buttonLogic.priceChangeApprove(orderInfo)) buttonSize++
    if (buttonLogic.endOrder(orderInfo)) buttonSize++
    if (buttonLogic.refundApprove(orderInfo) && orderInfo.payWay === 1) buttonSize++

    let hasBaseButton =
      buttonLogic.priceChangeApprove(orderInfo) ||
      buttonLogic.cashOrderConfirm(orderInfo) ||
      (buttonLogic.refundApprove(orderInfo) && orderInfo.payWay === 1)

    return buttonSize > 1 && hasBaseButton
  }
}

const entryLinkLogic = {
  isCashFlag: (orderInfo) => {
    return isWorker() && orderInfo.payWay === 1
  },
  isDepositFlag: (orderInfo) => {
    return (
      isWorker() && orderInfo.payWay === 1 && orderInfo.depositStatus === 1
    )
  },
  isWorker: () => {
    return isWorker()
  },
  associateOrderQR: (orderInfo) => {
    return isWorker() && !orderInfo.userBindStatus
  },
  showServiceLog: (orderInfo) => {
    return (
      orderInfo.distributeStatus !== 0 &&
      orderInfo.serviceStatus >= 2 &&
      orderInfo.realNum > 0
    )
  },
  showEvaluate: (orderInfo) => {
    return (
      isUser() &&
      (orderInfo.serviceStatus === 3 || orderInfo.serviceStatus === 4) &&
      orderInfo.payStatus &&
      !orderInfo.evaluate1 &&
      orderInfo.realNum !== 0
    )
  }
}

// 用户角色
function getRole () {
  return MyUtils.getItem('role')
}

// 是否主管/经理/管家
function isWorker () {
  const role = getRole()
  return role === '4' || isManager()
}
// 是否经理/管家
function isManager () {
  const role = getRole()
  return role === '3' || role === '7'
}

// 是否用户
function isUser () {
  return getRole() === '2'
}

// 是否用户/主管/经理/管家
function isUserOrManager () {
  return isWorker() || isUser()
}
export { buttonLogic, entryLinkLogic }
