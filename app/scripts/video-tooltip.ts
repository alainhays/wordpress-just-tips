/// <reference path="../../typings/index.d.ts" />

(function ($: JQueryStatic) {

  $(document).ready(() => {
    $('.video-tooltip-shortcode').each(function (index) {
      var preview = $(this);

      preview.tooltipster({
        position: preview.data('option-position') || 'top',
        contentAsHTML: true,
        content: '<div class="video-tooltip-video-wrapper"><div id="video-tooltip-player-' + index + '"></div></div>',
        functionReady: function () {
          switch (preview.data('provider')) {
            case 'youtube': {
              var player = new YT.Player('video-tooltip-player-' + index, {
                videoId: preview.data('video-id'),
                playerVars: {
                  'autohide': preview.data('option-autohide') || 2,
                  'autoplay': preview.data('option-autoplay') || 1,
                  'color': preview.data('option-color'),
                  'controls': preview.data('option-controls') || 0,
                  'end': preview.data('option-end'),
                  'loop': preview.data('option-loop'),
                  'modestbranding': 1,
                  'rel': 0,
                  'showinfo': 0,
                  'start': preview.data('option-begin')
                },
                events: {
                  'onReady': function (event) {
                    if (preview.data('option-mute') == '1') {
                      player.mute();
                    }
                    event.target.playVideo();
                  }
                }
              });
              break;
            }

            default:
              console.error('No valid provider found.');
          }
        }
      });
    });
  });

} ((window as any)['jQuery']));
