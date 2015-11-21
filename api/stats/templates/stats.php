<?php $this->layout('template', ['title' => 'TW Tactics Statistics']) ?>

<div class="jumbotron">
	<div class="container">
		<h1>TW Tactics Usage Stats</h1>
		<p>Time to find out if anyone is actually using it... <a href="d3.html">(D3.js version)</a></p>
	</div>
</div>

<div class="container">
	<div class="row">
		<div class="col-md-4">
			<h2>Downloads per day</h2>

			<table class="table table-hover">
				<tr class="info">
					<th>Day</th>
					<th>Downloads</th>
				</tr>
				<?php foreach($downloads as $download): ?>
				<tr>
					<td><?=$download['day']?></td>
					<td><?=$download['amount']?></td>
				</tr>
				<?php endforeach ?>
			</table>
		</div>
		<div class="col-md-8">
			<h2>Active Users</h2>

			<table class="table table-hover">
				<tr class="info">
					<th>World</th>
					<th>Player</th>
					<th>Downloads</th>
					<th>First</th>
					<th>Last</th>
				</tr>
				<?php foreach($users as $user): ?>
				<tr>
					<td><?=$user['world']?></td>
					<td><?=$user['player']?></td>
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
	<p>&copy; Sangu 2015</p>
	</footer>
</div>