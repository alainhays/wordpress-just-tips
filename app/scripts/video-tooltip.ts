/// <reference path="../../typings/index.d.ts" />

(function ($: JQueryStatic) {

  $(document).ready(() => {
    $('.video-tooltip-shortcode').each(function (index) {
      var tooltip = $(this);

      tooltip.tooltipster({
        animation: tooltip.data('option-animation') || 'swing',
        contentAsHTML: true,
        content: '<div class="video-tooltip-wrapper"><div id="video-tooltip-player-' + index + '"></div></div>',
        iconDesktop: true,
        iconTouch: true,
        position: tooltip.data('option-position') || 'top',
        theme: tooltip.data('option-theme') || 'tooltipster-light',
        functionReady: function () {
          switch (tooltip.data('provider')) {
            case 'youtube': {
              var player = new YT.Player('video-tooltip-player-' + index, {
                videoId: tooltip.data('video-id'),
                playerVars: {
                  'autohide': tooltip.data('option-autohide') || 2,
                  'autoplay': tooltip.data('option-autoplay') || 1,
                  'color': tooltip.data('option-color'),
                  'controls': tooltip.data('option-controls') || 0,
                  'end': tooltip.data('option-end'),
                  'loop': tooltip.data('option-loop'),
                  'modestbranding': 1,
                  'rel': 0,
                  'showinfo': 0,
                  'start': tooltip.data('option-begin')
                },
                events: {
                  'onReady': function (event) {
                    if (tooltip.data('option-mute') == '1') {
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
