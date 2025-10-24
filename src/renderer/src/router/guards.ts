import { useFlags } from '@/store'
import { useRouter } from 'vue-router'

export const beforeEach = (to, from, next) => {



  next()
}



//后置
export const afterEach = () => {
  const flags = useFlags()
  const router = useRouter()
  const position = router.options.history.state.position
  flags.forward(position)
}
