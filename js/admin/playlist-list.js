{
    let view = {
        el: '.playlist-container',
        template: `
            <ul class="playlist"></ul>
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            this.$el.html(this.template)
            let {playlists} = data
            this.$el.find('ul').empty()
            playlists.map((playlist)=>{
                this.$el.find('ul').append(`<li data-id="${playlist.id}">${playlist.name}</li>`)
            })

        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        },
        activeItem(li){
            $(li).addClass('active').siblings().removeClass('active')
        },
        updateActiveplaylist(data){
            this.$el.find('li.active').text(data.name)
        }
    }
    let model = {
        data: {
            playlists: []
        },
        find(){
            var query = new AV.Query('playlist');
            return query.find().then((playlists)=>{
                this.data.playlists = playlists.map((playlist)=>{
                    return {id:playlist.id,...playlist.attributes}
                })
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.getAllplaylists()
            this.bindEventHub()
            this.bindEvents()
        },
        getAllplaylists(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            this.view.$el.on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let playlistId = e.currentTarget.getAttribute('data-id')
                let obj = {}
                for(let i=0;i<this.model.data.playlists.length;i++){
                    if(this.model.data.playlists[i].id === playlistId){
                        obj = this.model.data.playlists[i]
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(obj)))
            })

        },
        bindEventHub(){
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(newplaylist)=>{
                console.log(newplaylist)
                this.model.data.playlists.push(newplaylist)
                this.view.render(this.model.data)
            })
            window.eventHub.on('update',(data)=>{
                // update model
                for(let i=0;i<this.model.data.playlists.length;i++){
                    if(this.model.data.playlists[i].id === data.id){
                        this.model.data.playlists[i] = data
                    }
                }
                this.view.updateActiveplaylist(data)
            })
        }
    }
    controller.init(view,model)
}
