<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
     console.log(icon);
    if (icon==='dashboard') {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }else{
       
       vnodes.push(<label class={"icon_nav  svg-icon"+" "+"iconfont"+" "+icon}></label>)
    }

    if (title) {
      vnodes.push(<span  slot='title'>{(title)}</span>)
      // <label style="font-size:14px;" class="cl_nav_item iconfont iconfanhuizuojiantouxiangzuoshangyibuxianxing"></label>
    }
    return vnodes
  }
}
</script>
<style>
  .cl_nav_item{
   position: absolute;
   right: 22px;
  }
  .icon_nav{
    font-size: 16px;
    /* color: #212c3d; */
    margin-right: 16px;
  }
</style>

