<?php

/**
* @link              https://github/nativecode-dev/plugin-video-tooltip
* @since             0.1.0
* @package           nativecode-plugin-video-tooltip
*
* @wordpress-plugin
* Plugin Name:       Video Tooltip
* Plugin URI:        https://github/nativecode-dev/plugin-video-tooltip
* Description:       Provides a shortcode that can be used to wrap an element and display a video tooltip.
* Version:           {VERSION}
* Author:            Mike Pham
* Author URI:        https://www.nativecode.com
* License:           GPL-2.0+
* License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
* Text Domain:       nativecode-plugin-video-tooltip
*/

if ( ! defined( 'WPINC' ) or ! defined( 'ABSPATH' ) ) {
    die('Nothing to do');
}

require plugin_dir_path( __FILE__ ) . 'video-tooltip.php';

function video_tooltip() {
    $plugin = new VideoTooltip();
    $plugin->run();
}

video_tooltip();