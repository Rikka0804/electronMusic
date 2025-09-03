import EventRoute from './EventRoute'

const routers = new Array()

/**
 *  关闭
 */
routers.push(
  new EventRoute('close-login',(api,data) => {
    api.mainWindow.close()
  })
)



export default routers
