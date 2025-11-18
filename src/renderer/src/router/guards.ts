import { useFlags ,useThemeStore} from '@/store'
import { useRouter } from 'vue-router'


export const beforeEach = (to, from, next) => {
  const themeStore = useThemeStore()
  themeStore.change()


  next()
}



//后置
export const afterEach = () => {
  const flags = useFlags()
  const router = useRouter()
  const position = router.options.history.state.position
  flags.forward(position)
}
