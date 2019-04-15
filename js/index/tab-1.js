{
    let view = {
        el: '#tab-1',
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
            this.loadModule()
            this.bindEventHub()
        },
        loadModule(){
            let script1 = document.createElement('script')
            script1.src = './js/index/tab-1-1.js'
            document.body.appendChild(script1)
            let script2 = document.createElement('script')
            script2.src = './js/index/tab-1-2.js'
            document.body.appendChild(script2)
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(data)=>{
                if(data === 'tab1'){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
        }
    }
    controller.init(view)
}
