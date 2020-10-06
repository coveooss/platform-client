export class DiffTemplate {
  static diffSource = `<!DOCTYPE html>
  <html class="coveo-styleguide">
    <head>
      <title>Source Diff</title>
      <meta about="Where would you like to go?" />
      <meta charset="utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, height=device-height" />

      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
      <!-- <script src="https://coveo.github.io/vapor/dist/js/CoveoStyleGuide.Dependencies.js"></script> -->

      <!-- <script src="http://react-vapor.surge.sh/assets/bundle.js"></script> -->
      <link rel="stylesheet" href="https://coveo.github.io/vapor/dist/css/CoveoStyleGuide.css" />

      <!-- Custom CSS -->
      <style>
        del,
        ins {
          text-decoration: none;
        }
        .change-focus {
          box-shadow: 0 0 6px 1px #1d4f76;
        }

        .highlight {
          font-size: 13px;
          font-family: monospace;
          line-height: 20px;
          margin: 1em 0;
          padding: 1em;
          background: #f6f6f6;
          border: 1px solid #eeeeee;
          border-radius: 0.15em;
          overflow: auto;
        }

        .palette div {
          padding: 0.5rem;
        }

        .navigation,
        .page-content {
          max-height: 100vh;
        }
      </style>
    </head>

    <script>
      window.sourcesToCreate = <%- SOURCES_TO_CREATE %>;
      window.sourcesToDelete = <%- SOURCES_TO_DELETE %>;
      window.sourcesToUpdate = <%- DIFF_OBJECT %>;
    </script>

    <body>
      <div class="flex flex-row application-wrapper">
        <div class="flex navigation-wrapper navigation-wrapper-opened">
          <nav class="navigation">
            <div class="navigation-menu" style="max-height: 300px">
              <ul class="navigation-menu-sections">
                <li class="block navigation-menu-section">
                  <header class="navigation-menu-section-header ml3">
                    <!-- SVG to update here -->
                    General <span class="text-tan-hide ml2" style="font-weight: normal"></span>
                    <span class="collapsible-arrow icon fill-white open">
                      <svg viewbox="0 0 12.6 7.2">
                        <path
                          d="M.945.046c.3 0 .5.1.7.3l4.6 4.6 4.6-4.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5.2 5.2c-.4.4-1.2.4-1.6 0l-5.2-5.2c-.4-.4-.4-1 0-1.4.2-.2.4-.3.7-.3"
                        />
                      </svg>
                    </span>
                  </header>
                  <ul id="summary-menu-section" class="navigation-menu-section-items">
                    <a class="block navigation-menu-section-item" href="#" onclick="javascript:showSummary()"
                      ><span class="navigation-menu-section-item-link">Summary</span></a
                    >
                  </ul>
                </li>
                <li class="block navigation-menu-section">
                  <header class="navigation-menu-section-header ml3">
                    <!-- SVG to update here -->
                    <%=resourceType%>s to update <span id="source-list-to-update-count" class="text-tan-hide ml2" style="font-weight: normal"></span>
                    <span class="collapsible-arrow icon fill-white open">
                      <svg viewbox="0 0 12.6 7.2">
                        <path
                          d="M.945.046c.3 0 .5.1.7.3l4.6 4.6 4.6-4.6c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-5.2 5.2c-.4.4-1.2.4-1.6 0l-5.2-5.2c-.4-.4-.4-1 0-1.4.2-.2.4-.3.7-.3"
                        />
                      </svg>
                    </span>
                  </header>
                  <ul id="source-list-to-update" class="navigation-menu-section-items"></ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div class="page-content application-container">
          <div class="material-card m4">
            <div class="p2">
              <div id="diff-summary">
                <label class="form-control-label"><%=resourceType%>s</label>
                <div class="tab-navigation">
                  <div id="tab1" class="tab enabled active">To Create</div>
                  <div id="tab2" class="tab enabled">To Delete</div>
                  <!-- <div id="tab3" class="tab enabled">Update</div> -->
                </div>
                <div class="tab-content">
                  <div data-tab="tab1" class="tab-pane active">
                    <ul class="mod-header-padding mod-form-top-bottom-padding" id="sources-to-create-list"></ul>
                  </div>
                  <div data-tab="tab2" class="tab-pane">
                    <ul class="mod-header-padding mod-form-top-bottom-padding" id="sources-to-delete-list"></ul>
                  </div>
                  <!-- <div data-tab="tab3" class="tab-pane">
                      <div class="mod-header-padding mod-form-top-bottom-padding">
                        More details in the <b>Sources to Update</b> section.
                      </div>
                    </div> -->
                </div>

                <script type="text/javascript">
                  var tab1 = $('#tab1');
                  var tab2 = $('#tab2');
                  // var tab3 = $('#tab3');
                  var tabpane1 = $('[data-tab=tab1]');
                  var tabpane2 = $('[data-tab=tab2]');
                  // var tabpane3 = $('[data-tab=tab3]');

                  tab1.on('click', function() {
                    tab1.addClass('active');
                    tab2.removeClass('active');
                    // tab3.removeClass('active');
                    tabpane1.addClass('active');
                    tabpane2.removeClass('active');
                    // tabpane3.removeClass('active');
                  });

                  tab2.on('click', function() {
                    tab1.removeClass('active');
                    tab2.addClass('active');
                    // tab3.removeClass('active');
                    tabpane1.removeClass('active');
                    tabpane2.addClass('active');
                    // tabpane3.removeClass('active');
                  });

                  // tab3.on('click', function() {
                  //   tab1.removeClass('active');
                  //   tab2.removeClass('active');
                  //   tab3.addClass('active');
                  //   tabpane1.removeClass('active');
                  //   tabpane2.removeClass('active');
                  //   tabpane3.addClass('active');
                  // });
                </script>
              </div>

              <div id="diff-source-section" class="hidden">
                <h4 class="mb2">
                  <span id="addition-count" class="text-green"> </span> &nbsp; <span id="deletion-count" class="text-red"> </span>
                </h4>
                <div class="form-control fixed m1" id="navigation-section" style="right:4rem;">
                  <button class="btn mod-small navigation-button" onclick="javascript:jumpToPreviousChange(this)">Previous</button>
                  <button class="btn mod-small navigation-button" onclick="javascript:jumpToNextChange(this)">Next</button>
                </div>
                <figure class="highlight p0"><pre id="result"></pre></figure>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function jumpToPreviousChange(_this) {
          $('.navigation-button').removeClass('state-disabled');
          var elmnts = $('.diff-change');
          elmnts.removeClass('change-focus');
          var indexCount = _this.parentElement.getAttribute('data-index') || -1;
          console.log(indexCount);

          if (parseInt(indexCount) > 0) {
            var elem = elmnts[parseInt(indexCount) - 1];
            elem.classList.add('change-focus');
            // elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            $('.page-content')
              .stop()
              .animate(
                {
                  scrollTop: elem.getBoundingClientRect().y + $('.page-content')[0].scrollTop - Math.floor(window.innerHeight * 0.3)
                },
                300,
                'swing',
                function() {}
              );
            _this.parentElement.setAttribute('data-index', parseInt(indexCount) - 1);
          } else {
            _this.classList.add('state-disabled');
          }
        }

        function jumpToNextChange(_this) {
          $('.navigation-button').removeClass('state-disabled');
          var elmnts = $('.diff-change');
          elmnts.removeClass('change-focus');
          var indexCount = _this.parentElement.getAttribute('data-index') || -1;
          console.log(indexCount);

          if (parseInt(indexCount) + 1 < elmnts.length) {
            var elem = elmnts[parseInt(indexCount) + 1];
            elem.classList.add('change-focus');
            // elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            $('.page-content')
              .stop()
              .animate(
                {
                  scrollTop: elem.getBoundingClientRect().y + $('.page-content')[0].scrollTop - Math.floor(window.innerHeight * 0.3)
                },
                300,
                'swing',
                function() {}
              );
            _this.parentElement.setAttribute('data-index', (parseInt(indexCount) + 1) % elmnts.length);
          } else {
            _this.classList.add('state-disabled');
          }
        }

        function getModificationCount(jsonDiff) {
          let count = [0, 0];
          _.each(jsonDiff, part => {
            if (part.added) {
              count[0]++;
            }
            if (part.removed) {
              count[1]++;
            }
          });
          return count;
        }

        function showSummary() {
          $('.navigation-menu-section-item').removeClass('state-active');
          const summaryItem = document.querySelector('#summary-menu-section .navigation-menu-section-item');
          summaryItem.classList.add('state-active');

          $('#diff-summary').removeClass('hidden');
          $('#diff-source-section').addClass('hidden');

          let sourcesToCreate = document.getElementById('sources-to-create-list');
          sourcesToCreate.innerHTML = '';

          let sourcesToDelete = document.getElementById('sources-to-delete-list');
          sourcesToDelete.innerHTML = '';

          window.sourcesToCreate.forEach(sourceNameToCreate => {
            let li = document.createElement('li');

            let element = document.createElement('h4');
            element.className = 'title-text mt1';
            element.textContent = sourceNameToCreate;

            li.appendChild(element);
            sourcesToCreate.appendChild(li);
          });

          window.sourcesToDelete.forEach(sourceNameToDelete => {
            let li = document.createElement('li');

            let element = document.createElement('h4');
            element.className = 'title-text mt1';
            element.textContent = sourceNameToDelete;

            li.appendChild(element);
            sourcesToDelete.appendChild(li);
          });
        }

        function handleUpdatedSourceChange(sourceDiff) {
          document.getElementById('navigation-section').setAttribute('data-index', -1);
          const sourceDiffKeys = _.keys(sourceDiff)[0];
          const jsonDiff = sourceDiff[sourceDiffKeys];

          // Activate back navigation button
          $('.navigation-button').removeClass('state-disabled');
          // Select the source tab
          $('.navigation-menu-section-item').removeClass('state-active');
          $('#diff-source-section').removeClass('hidden');
          $('#diff-summary').addClass('hidden');

          const sourceTab = document.querySelector('li[data-source-name="' + sourceDiffKeys + '"]');
          sourceTab.classList.add('state-active');

          const modificationsCount = getModificationCount(jsonDiff);
          document.getElementById('addition-count').textContent = modificationsCount[0] > 0 ? '+ ' + modificationsCount[0] : '';
          document.getElementById('deletion-count').textContent = modificationsCount[1] > 0 ? '- ' + modificationsCount[1] : '';

          changed(jsonDiff);
        }

        function changed(diff) {
          var fragment = document.createDocumentFragment();
          for (var i = 0; i < diff.length; i++) {
            if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
              var swap = diff[i];
              diff[i] = diff[i + 1];
              diff[i + 1] = swap;
            }

            var node;
            if (diff[i].removed) {
              node = document.createElement('div');
              node.className = 'bg-soft-red diff-change';
              node.appendChild(document.createTextNode(diff[i].value.replace(/^(.)/gm, '- $1')));
            } else if (diff[i].added) {
              node = document.createElement('div');
              node.className = 'bg-soft-green diff-change';
              node.appendChild(document.createTextNode(diff[i].value.replace(/^(.)/gm, '+ $1')));
            } else {
              node = document.createTextNode(diff[i].value.replace(/^(.)/gm, '  $1'));
            }
            fragment.appendChild(node);
          }
          var result = document.getElementById('result');
          result.textContent = '';
          result.appendChild(fragment);
        }

        function buildSourcesToUpdateTabs(source) {
          const sources = window.sourcesToUpdate;

          let sourceList = document.getElementById('source-list-to-update');
          sources.forEach(source => {
            const keys0 = _.keys(source)[0];
            let li = document.createElement('li');
            li.className = 'navigation-menu-section-item';
            li.setAttribute('data-source-name', keys0);

            let anchor = document.createElement('a');
            anchor.className = 'block navigation-menu-section-item-link';
            anchor.href = '#';
            anchor.onclick = () => handleUpdatedSourceChange(source);
            anchor.textContent = keys0;

            li.appendChild(anchor);
            sourceList.appendChild(li);
          });

          // Add updated source count
          sourceList = document.getElementById('source-list-to-update-count');
          sourceList.textContent = '(' + sources.length + ')';
          // Show first source form the list
          //handleUpdatedSourceChange(_.values(sources)[0]);
        }

        document.addEventListener('DOMContentLoaded', function() {
          showSummary();
          buildSourcesToUpdateTabs();
        });
      </script>

      <script>
        $(document).ready(function() {
          // manually reset the hash to force the browser to go to the selected menu item on page refresh
          var hash = window.location.hash;
          window.location.hash = '';
          window.location.hash = hash;

          var selectedTab;
          if (window.location.hash) {
            var selectedTabChild = $('.navigation-menu-section-item-link[href="' + window.location.pathname + window.location.hash + '"]');
            selectedTab = selectedTabChild.parent().addClass('state-active');
          } else {
            var selectedTabParend = $('.navigation-menu-section-item-link[href*="' + window.location.pathname + '"]');
            selectedTab = $(selectedTabParend[0])
              .parent()
              .addClass('state-active');
          }

          $('.navigation-menu-section-item').click(function() {
            if (selectedTab) {
              selectedTab.removeClass('state-active');
            }
            $(this).addClass('state-active');
            selectedTab = $(this);
          });

          $('.navigation-menu-section-header').click(function(event) {
            $(this)
              .find('.collapsible-arrow')
              .toggleClass('open');
            $(this)
              .next('.navigation-menu-section-items')
              .slideToggle();
          });

          // Simple script to handle opening/closing modals
          function modalHandler() {
            var backdrop = $('.modal-backdrop');

            $('.js-modal-trigger').each(function(i, modalTrigger) {
              var modal = $('#' + modalTrigger.getAttribute('data-modal'));
              var modalPrompt = $('#' + modalTrigger.getAttribute('data-modal') + 'Prompt');

              var closeButton = modal.find('.js-modal-close');
              var promptCloseButton = modalPrompt.find('.js-modal-close');

              function removeModal() {
                modal.removeClass('opened');

                backdrop.addClass('closed');

                backdrop.off('click', removeModal);
              }

              function removePrompt() {
                modalPrompt.removeClass('opened');

                modal.find('.prompt-backdrop').addClass('closed');

                backdrop.off('click', removePrompt);

                backdrop.on('click', removeModal);
              }

              $(modalTrigger).on('click', function() {
                modal.addClass('opened');

                backdrop.removeClass('closed');

                if (modalPrompt.length > 0) {
                  modalPrompt.addClass('opened');

                  backdrop.on('click', removePrompt);
                } else {
                  backdrop.on('click', removeModal);
                }
              });

              closeButton.on('click', function(event) {
                event.stopPropagation();
                removeModal();
              });

              promptCloseButton.on('click', function(event) {
                event.stopPropagation();
                removePrompt();
              });
            });
          }

          modalHandler();

          function expandRowView($el) {
            $el.find('tr.heading-row').addClass('opened');
            $el.find('tr.collapsible-row').addClass('in');
            $el.find('tr.collapsible-row .container').slideDown(400);
            $el.find('[data-collapse-state]').attr('data-collapse-state', 'expanded');
          }

          function collapseRowView($el) {
            $el.find('tr.heading-row').removeClass('opened');
            $el.find('tr.collapsible-row').removeClass('in');
            $el.find('tr.collapsible-row .container').slideUp(400);
            $el.find('[data-collapse-state]').attr('data-collapse-state', 'collapsed');
          }

          $('tr.heading-row').click(function(jQueryEventObject) {
            var $el = $(jQueryEventObject.currentTarget);
            if ($el.hasClass('opened')) {
              collapseRowView($el.parent());
            } else {
              expandRowView($el.parent());
            }
          });

          // Handle open/close dropdown
          $('button.dropdown-toggle').click(function(event) {
            var dropdownEl = $(event.currentTarget).parent();
            dropdownEl.toggleClass('open', !dropdownEl.hasClass('open'));
          });

          // Handle open/close dropdown search
          $('.mod-search button.dropdown-toggle').click(function(event) {
            var buttonEl = $(event.currentTarget);
            var dropdownEl = $(event.currentTarget).parent();
            buttonEl.toggleClass('open', !dropdownEl.hasClass('open'));
            buttonEl.toggleClass('hidden', !dropdownEl.hasClass('hidden'));

            dropdownEl.find('.coveo-filter-container').toggleClass('hidden');
            dropdownEl.find('.filter-box').focus();
          });

          $('.mod-search .filter-box').blur(function(event) {
            var filterElement = $(event.currentTarget).parent();
            var dropdownEl = filterElement.parent();
            filterElement.find('filter-box').context.value = '';
            filterElement.addClass('hidden');

            dropdownEl.removeClass('open');
            dropdownEl.find('button.dropdown-button-search-container').removeClass('hidden');
          });

          // Handle selection in flat-select
          $('.flat-select-option').click(function(event) {
            var optionEl = $(event.currentTarget);
            var flatSelectEl = optionEl.parent();

            flatSelectEl.find('.flat-select-option:not(.selectable)').addClass('selectable');
            optionEl.removeClass('selectable');
          });

          // Handle flippable flip/unflip
          $('.flippable').click(function() {
            $(this)
              .find('.flipper')
              .toggleClass('show-back')
              .toggleClass('show-front');
          });

          // handle side nav toggle
          /* document.querySelector('.header-hamburger').addEventListener('click', () => {
                document.querySelector('.navigation-wrapper').classList.toggle('navigation-wrapper-opened');
                document.querySelector('.header-hamburger').classList.toggle('header-hamburger-opened');
              }); */
        });
      </script>
    </body>
  </html>`;
}
