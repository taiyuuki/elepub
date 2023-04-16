import {
  mdiCheckCircleOutline,
  mdiAlertOutline,
  mdiAlertRhombusOutline,
  mdiAlertCircleOutline,
} from '@quasar/extras/mdi-v6'
type NotifyType = 'positive' | 'negative' | 'warning' | 'info' | 'ongoing'
export const alertNotify = (message: string, type?: NotifyType) => {
  let icon = ''
  type = type ?? 'warning'
  switch (type) {
    case 'positive':
      icon = mdiCheckCircleOutline
      break
    case 'negative':
      icon = mdiAlertOutline
      break
    case 'warning':
      icon = mdiAlertRhombusOutline
      break
    case 'info':
      icon = mdiAlertCircleOutline
      break
  }
  Notify.create({
    message,
    type,
    position: 'top',
    icon,
  })
}

export const alertDilog = (
  title: string,
  message: string,
  okCb?: () => void,
  cancelCb?: () => void
) => {
  const chainable = Dialog.create({
    title,
    message,
    class: 'alert-dialog',
    ok: '确定',
    cancel: '取消',
  })
  if (okCb) {
    chainable.onOk(okCb)
  }
  if (cancelCb) {
    chainable.onCancel(cancelCb)
  }
}