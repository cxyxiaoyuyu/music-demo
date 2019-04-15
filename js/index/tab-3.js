{
    let view = {
        el: '#tab-3',
        init(){
            this.$el = $(this.el)
        },
        active(){
            this.$el.addClass('active')
        },
        deactive(){
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
            window.eventHub.on('selectTab',(data)=>{
                if(data == 'tab3'){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
        }
    }
    controller.init(view)
}
