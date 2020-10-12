from rest_framework import permissions

from groups.models.group import GroupModel


class IsKoieAdmin(permissions.BasePermission):
    """Checks that user is a board member in NTNUI koiene """

    message = "You must be a board member from koiene."

    def has_object_permission(self, request, view):
        koie_group = GroupModel.objects.get(slug="koiene")
        return (
            request.user.is_authenticated
            and koie_group
            and koie_group.get_membership(request.user)
            and koie_group.get_membership(request.user).is_board_member()
        )
