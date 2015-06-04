<?php $this->layout('template', ['title' => 'TW Tactics stats']) ?>

<h1>TW Tactics stats</h1>

<table>
	<tr>
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