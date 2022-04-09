// import Main from '@/components/main'

export default [
    {
        // 首页
        path: '/',
        name: 'myIndex',
        component: () => import('@/views/home/myIndex')
    },
    {
        path: '/picTotext',
        name: 'picTotext',
        component: () => import('@/views/picTotext')
    },
    
]
