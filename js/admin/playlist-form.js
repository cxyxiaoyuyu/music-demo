{
    let view = {
        el: '.container > main',
        init(){
            this.$el = $(this.el)
        },
        template: `
         <form class="form">
                <div class="row">
                    <span>歌单名</span>
                    <input type="text" value="__name__" name="name">
                </div>
                <div class="row">
                    <span>标签</span>
                    <input type="text" value="__tag__" name="tag">
                </div>
                <div class="row">
                    <span>简介</span>
                    <textarea name="summary">__summary__</textarea>
                </div>
                <div class="row">
                    <span>歌单图片</span>
                    <input type="text" value="__img__" name="img">
                </div>
                <div class="row submit">
                    <button>submit</button>
                </div>
            </form>
        `,
        render(data={}){
            console.log(data)
            let placeholder = ['name','tag','summary','img']
            let html = this.template
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).find('.form').prepend('<h1>编辑歌单</h1>')
            }else{
                $(this.el).find('.form').prepend('<h1>新建歌单</h1>')
            }
        }
    }
    let model = {
        data: {name:'',tag:'',summary:'','img':''},
        create(obj){
            console.log('create')
            var playlist = AV.Object.extend('playlist');
            var playlist = new playlist();
            playlist.set('name', obj.name);
            playlist.set('tag', obj.tag);
            playlist.set('summary', obj.summary);
            playlist.set('img', obj.img);
            return playlist.save().then((newplaylist)=>{
                console.log(newplaylist)
                let {id,attributes} = newplaylist
                Object.assign(this.data,{id,...attributes})
            })
        },
        update(obj){
            console.log('update')
            var playlist = AV.Object.createWithoutData('playlist', this.data.id);
            playlist.set('name', obj.name);
            playlist.set('tag', obj.singer);
            playlist.set('summary', obj.summary);
            playlist.set('img', obj.img);
            Object.assign(this.data,obj)
            console.log(this.data)
            return playlist.save()
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.view.render()
            this.bindEventHub()
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('submit','.form',(e)=>{
                e.preventDefault()
                let needs = ['name','tag','summary','img']
                let obj = {}
                needs.map((string)=>{
                    obj[string] = this.view.$el.find(`[name=${string}]`).val()
                })
                console.log(this.model.data,'xxxx')
                if(this.model.data.id){
                    console.log('update')
                    this.model.update(obj).then(()=>{
                        console.log('ok')
                        window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))
                    })
                }else{
                    console.log('create')
                    this.model.create(obj).then(()=>{
                        // deep copy,it's necessary
                        console.log('11111')
                        let string = JSON.stringify(this.model.data)
                        let newplaylist = JSON.parse(string)
                        this.view.render({})
                        window.eventHub.emit('create',newplaylist)
                    })
                }
            })
        },
        bindEventHub(){
            window.eventHub.on('upload',(data)=>{
                console.log('playlist form get data')
                this.model.data = data
                this.view.render(data)
            })
            window.eventHub.on('select',(data)=>{
                console.log(data)
                this.model.data = data
                this.view.render(data)
            })
        }
    }
    controller.init(view,model)
}
