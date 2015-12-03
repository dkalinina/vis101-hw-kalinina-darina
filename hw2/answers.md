Question 0.1. What is the meaning of the horizontal and vertical position of the nodes? Give examples of datasets particularly well suited to organize data this way.
Положение по х и у для соответствующего узлу элемента.
В принципе, любые quantitative характеристики. Не их тоже можно, но градация положения интуитивно легко связавается с численным сравнением (во сколько раз больше, на сколько больше).
Самым часто встречающимся случаем, на мой взгляд, является изменение какой-либо величины во времени.

Question 0.2. Which other channels (visual variables), beside color, size and position, could have been used? Name five.
Яркость, насыщенность, ориентация, форма, подвижность(сама по себе или видами движений)

Question 0.3. Are all the previously mentioned visual variables independent (e.g. if you change one, will it impact others?)? Give examples of graphical properties that are dependent (if any) and independent (if any) from each others.
Цветовой блок - цвет, яркость, насыщенность - очень сильно зависим.
А вот цвет и размер друг от друга не зависят вообще.
Размер и положение зависимы частично - например, на больших расстояниях, малые разницы в размерах теряются.

Question 1.1. Discuss the pros and cons of the two types of rankings (either by relative or absolute position between nodes).
Относительная позиция лучше показывает изменение какой либо величины (особенно, если изменения небольшие относительно самой величины), но теряет ее значения сами по себе, даже если их явно отображать. Для этого лучше абсолютные позиции. А при абсолютных позициях разница может потеряться. И еще при абсолютных позициях график может быть нерационально большим.

Question 1.2. Which data type (quantitative, ordinal, ..) is best displayed with scatterplots? Which one is not? Give examples.
quantitative, потому что для них адекватно воспринимается расстояние между элементами. Географические координаты, например, чуть ли не чистые позиции х, у.
У ordinal с этим хуже, но применить можно. Например, если задать равномерную "сетку".
А с categorical все совсем плохо и лучше не надо. Как в примере с финансами США, когда по оси х они делились на категории.

Question 2.1. What are the pros and cons of using a D3 layout? For example, why would we use the D3 pie layout when we could use a simple circle for layouting?
Они уже написаны - главное преимущество. И они достаточно обобщенные, чтобы можно было взять только кусок и дополнить своим при необходимости.

Question 3.1. Which other strategies can you think of to reduce the visual complexity? One example is edge bundling which we introduce in the following section. Enumerate up to three other strategies.
Выводить отдельные графики.
Разделить данные на различные вложенные уровни подробности и добавить возможность переключаться между ними.
Выкинуть или сгруппировать часть данных.
