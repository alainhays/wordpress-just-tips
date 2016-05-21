<?php

/**
 * @link              https://github/nativecode-dev/plugin-video-tooltip
 * @since             1.0.0
 * @package           nativecode-plugin-video-tooltip
 *
 * @wordpress-plugin
 * Plugin Name:       Video Tooltip
 * Plugin URI:        https://github/nativecode-dev/plugin-video-tooltip
 * Description:       Provides a shortcode that can be used to wrap an element and display a video tooltip.
 * Version:           1.0.0
 * Author:            Mike Pham
 * Author URI:        https://www.mikepham.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nativecode-plugin-video-tooltip
 */

/**
 * Make sure we're running in the desired context.
 */
if ( ! defined( 'WPINC' ) or ! defined( 'ABSPATH' ) ) {
  die('Nothing to do');
}

require plugin_dir_path( __FILE__ ) . 'includes/video-tooltip.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function video_tooltip() {
  $plugin = new VideoTooltip();
  $plugin->run();
}

video_tooltip();
