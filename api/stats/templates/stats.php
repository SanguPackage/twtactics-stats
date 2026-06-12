<?php $this->layout('template', ['title' => 'TW Tactics Statistics']) ?>

<div class="jumbotron">
	<div class="container">
		<h1>TW Tactics &mdash; <?=$totals['firstYear']?>&ndash;<?=$totals['lastYear']?></h1>
		<p><?=number_format($totals['downloads'])?> snapshot downloads over <?=$totals['lastYear'] - $totals['firstYear']?> years. <a href="d3.html">(D3.js version)</a></p>
	</div>
</div>

<div class="container">
	<div class="row text-center stat-band">
		<?php foreach (['downloads' => 'Downloads', 'players' => 'Players', 'tribes' => 'Tribes', 'worlds' => 'Worlds', 'servers' => 'Servers'] as $key => $label): ?>
			<div class="col-xs-4 col-md-2">
				<div class="stat-number"><?=number_format($totals[$key])?></div>
				<div class="text-muted"><?=$label?></div>
			</div>
		<?php endforeach ?>
		<div class="col-xs-4 col-md-2">
			<div class="stat-number"><?=$totals['firstYear']?>&ndash;<?=$totals['lastYear']?></div>
			<div class="text-muted">Years</div>
		</div>
	</div>

	<div class="row">
		<div class="col-md-7">
			<h2>Downloads per year</h2>
			<svg id="downloads-per-year"></svg>
		</div>
		<div class="col-md-5">
			<h2>Top servers</h2>
			<table class="table table-hover table-condensed">
				<tr class="info"><th>Server</th><th>Downloads</th></tr>
				<?php foreach ($topServers as $s): ?>
				<tr>
					<td><?=$this->e($s['server'])?></td>
					<td><?=number_format($s['downloads'])?></td>
				</tr>
				<?php endforeach ?>
			</table>
		</div>
	</div>

	<div class="row">
		<div class="col-md-12">
			<h2>Most active players</h2>
			<table class="table table-hover table-condensed">
				<tr class="info">
					<th>Server</th><th>World</th><th>Player</th><th>Downloads</th><th>First</th><th>Last</th>
				</tr>
				<?php foreach ($users as $user): ?>
				<tr>
					<td><?=$this->e(str_replace(['www.', 'tribalwars'], ['', 'tw'], $user['server']))?></td>
					<td><?=$this->e($user['world'])?></td>
					<td><?=$this->e($user['player'])?></td>
					<td><?=$user['downloads']?></td>
					<td><?=$user['FirstDate']?></td>
					<td><?=$user['LastDate']?></td>
				</tr>
				<?php endforeach ?>
			</table>
		</div>
	</div>

	<hr>

	<footer>
	<p>&copy; Sangu <?=$totals['firstYear']?>&ndash;<?=$totals['lastYear']?></p>
	</footer>
</div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="stats.js"></script>
<script>
	var perYear = <?=json_encode($perYear)?>;
	perYear.forEach(function(d) { d.year = +d.year; d.downloads = +d.downloads; });
	drawPerYear('#downloads-per-year', perYear);
</script>
