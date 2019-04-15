{
    let view = {
        el: '#site-loading',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let controller = {
        init(view){
            this.view = view
            this.view.init()
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeUpload',()=>{
                console.log('beforeupload')
                this.view.show()
            })
            window.eventHub.on('afterUpload',()=>{
                console.log('afterupload')
                this.view.hide()
            })
        }
    }
    controller.init(view)
}
