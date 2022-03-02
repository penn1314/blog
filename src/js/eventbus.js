import mitt from 'mitt'
// 创建Eventbus实例对象
const bus = mitt()
// 共享实例对象
export default bus
