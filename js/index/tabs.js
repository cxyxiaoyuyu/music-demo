{
    let view = {
        el: '#navTab',
        init(){
            this.$el = $(this.el)
        }
    }
    let controller = {
        init(view){
            this.view = view
            this.view.init()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.tab',(e)=>{
                $(e.currentTarget).addClass('active').siblings().removeClass('active')
                let tab_number = $(e.currentTarget).attr('tab')
                console.log(tab_number)
                window.eventHub.emit('selectTab',tab_number)
            })
        }

    }

    controller.init(view)
}
