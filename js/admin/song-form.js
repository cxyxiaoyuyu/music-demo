{
    let view = {
        el: '.container > main',
        init(){
            this.$el = $(this.el)
        },
        template: `
         <form class="form">
                <div class="row">
                    <span>歌名</span>
                    <input type="text" value="__name__" name="name">
                </div>
                <div class="row">
                    <span>歌手</span>
                    <input type="text" value="__singer__" name="singer">
                </div>
                <div class="row">
                    <span>链接</span>
                    <input type="text" value="__url__" name="url">
                </div>
                <div class="row">
                    <span>背景图片</span>
                    <input type="text" value="__img__" name="img">
                </div>
                <div class="row">
                    <span>歌词</span>
                    <textarea name="lyrics" style="width: 450px;height:122px;">__lyrics__</textarea>
                </div>
                <div class="row submit">
                    <button>submit</button>
                </div>
            </form>
        `,
        render(data={}){
            console.log(data)
            let placeholder = ['name','url','singer','img','lyrics']
            let html = this.template
            placeholder.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).find('.form').prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).find('.form').prepend('<h1>新建歌曲</h1>')
            }
        }
    }
    let model = {
        data: {name:'',singer:'',url:'',id:'','img':'','lyrics':''},
        create(obj){
            console.log('create')
            var song = AV.Object.extend('song');
            var song = new song();
            song.set('name', obj.name);
            song.set('singer', obj.singer);
            song.set('lyrics', obj.lyrics);
            song.set('url', obj.url);
            song.set('img', obj.img);
            return song.save().then((newSong)=>{
                console.log(newSong)
                let {id,attributes} = newSong
                Object.assign(this.data,{id,...attributes})
            }, function (error) {
                // 异常处理
                console.error('Failed to create new object, with error message: ' + error.message);
            });
        },
        update(obj){
            console.log('update')
            var song = AV.Object.createWithoutData('song', this.data.id);
            song.set('name', obj.name);
            song.set('singer', obj.singer);
            song.set('lyrics', obj.lyrics);
            song.set('url', obj.url);
            song.set('img', obj.img);
            Object.assign(this.data,obj)
            console.log(this.data)
            return song.save()
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
                let needs = ['name','singer','url','img','lyrics']
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
                        let string = JSON.stringify(this.model.data)
                        let newSong = JSON.parse(string)
                        window.eventHub.emit('create',newSong)
                    })
                }
            })
        },
        bindEventHub(){
            window.eventHub.on('upload',(data)=>{
                console.log('song form get data')
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
