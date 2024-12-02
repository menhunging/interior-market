if ($("#modal-tags").length > 0) {
  $(".delete-tag").on("click", function (e) {
    console.log("delete");
  });

  $(".save-tags").on("click", function (e) {
    const select = $(".select-tags");
    const tagsValue = select.val();
    closeModal("modal-add-tags");

    console.log("ajax: ", tagsValue);
  });
}
